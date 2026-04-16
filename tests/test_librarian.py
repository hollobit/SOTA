"""Tests for LibrarianAgent."""

from __future__ import annotations

from datetime import date

import pytest

from cyber.agents.librarian import LibrarianAgent, HIGH_TRUST_DOMAINS
from cyber.models.types import SourceEntry


def _make_source(**kwargs) -> SourceEntry:
    defaults = dict(
        id="test",
        url="https://example.com",
        name="Test",
        type="leaderboard",
        format="html_table",
        trust_score=0.5,
        status="active",
        discovered_by="seed",
        discovered_at=date(2026, 1, 1),
        crawl_count=0,
        change_count=0,
        fail_count=0,
    )
    defaults.update(kwargs)
    return SourceEntry(**defaults)


@pytest.fixture
def agent() -> LibrarianAgent:
    return LibrarianAgent()


class TestComputeInterval:
    def test_zero_crawls(self, agent: LibrarianAgent) -> None:
        src = _make_source(crawl_count=0, change_count=0)
        assert agent.compute_interval(src) == 24

    def test_high_change_rate(self, agent: LibrarianAgent) -> None:
        src = _make_source(crawl_count=10, change_count=8)
        assert agent.compute_interval(src) == 6

    def test_medium_change_rate(self, agent: LibrarianAgent) -> None:
        src = _make_source(crawl_count=10, change_count=3)
        assert agent.compute_interval(src) == 24

    def test_low_change_rate(self, agent: LibrarianAgent) -> None:
        src = _make_source(crawl_count=100, change_count=10)
        assert agent.compute_interval(src) == 72

    def test_very_low_change_rate(self, agent: LibrarianAgent) -> None:
        src = _make_source(crawl_count=100, change_count=1)
        assert agent.compute_interval(src) == 168


class TestComputeTrust:
    def test_cross_validation_bonus(self, agent: LibrarianAgent) -> None:
        src = _make_source(trust_score=0.5)
        trust = agent.compute_trust(src, cross_validation_pass=True)
        assert trust > 0.5

    def test_first_sota_bonus(self, agent: LibrarianAgent) -> None:
        src = _make_source(trust_score=0.5)
        trust = agent.compute_trust(src, first_sota_reporter=True)
        assert trust > 0.5

    def test_fail_penalty(self, agent: LibrarianAgent) -> None:
        src = _make_source(trust_score=0.5, fail_count=5)
        trust = agent.compute_trust(src)
        assert trust < 0.5

    def test_high_trust_domain_bonus(self, agent: LibrarianAgent) -> None:
        src = _make_source(trust_score=0.5, url="https://arxiv.org/abs/123")
        trust = agent.compute_trust(src)
        assert trust > 0.5

    def test_clamp_max(self, agent: LibrarianAgent) -> None:
        src = _make_source(trust_score=0.95, url="https://arxiv.org/abs/123")
        trust = agent.compute_trust(src, cross_validation_pass=True, first_sota_reporter=True)
        assert trust <= 1.0

    def test_clamp_min(self, agent: LibrarianAgent) -> None:
        src = _make_source(trust_score=0.1, fail_count=10)
        trust = agent.compute_trust(src)
        assert trust >= 0.0


class TestCheckHealth:
    def test_too_many_fails_dead(self, agent: LibrarianAgent) -> None:
        src = _make_source(fail_count=5)
        assert agent.check_health(src) == "dead"

    def test_low_trust_paused(self, agent: LibrarianAgent) -> None:
        src = _make_source(trust_score=0.2, fail_count=0)
        assert agent.check_health(src) == "paused"

    def test_candidate_with_success_active(self, agent: LibrarianAgent) -> None:
        src = _make_source(status="candidate", crawl_count=3, fail_count=1)
        assert agent.check_health(src) == "active"

    def test_candidate_14_days_no_crawl_dead(self, agent: LibrarianAgent) -> None:
        src = _make_source(status="candidate", discovered_at=date(2026, 1, 1), crawl_count=0)
        assert agent.check_health(src, as_of=date(2026, 1, 20)) == "dead"

    def test_active_stays_active(self, agent: LibrarianAgent) -> None:
        src = _make_source(status="active", crawl_count=5, fail_count=0)
        assert agent.check_health(src) == "active"


class TestIsConferenceSeason:
    def test_neurips_dec(self, agent: LibrarianAgent) -> None:
        assert agent.is_conference_season(date(2026, 12, 5))

    def test_icml_jul(self, agent: LibrarianAgent) -> None:
        assert agent.is_conference_season(date(2026, 7, 20))

    def test_iclr_may(self, agent: LibrarianAgent) -> None:
        assert agent.is_conference_season(date(2026, 5, 10))

    def test_acl_jul(self, agent: LibrarianAgent) -> None:
        assert agent.is_conference_season(date(2026, 7, 5))

    def test_not_conference(self, agent: LibrarianAgent) -> None:
        assert not agent.is_conference_season(date(2026, 3, 15))


class TestApplyBoost:
    def test_default_factor(self, agent: LibrarianAgent) -> None:
        assert agent.apply_boost(24) == 12

    def test_floor_at_6(self, agent: LibrarianAgent) -> None:
        assert agent.apply_boost(6, factor=0.5) == 6

    def test_custom_factor(self, agent: LibrarianAgent) -> None:
        assert agent.apply_boost(48, factor=0.25) == 12


class TestHighTrustDomains:
    def test_known_domains(self) -> None:
        assert "arxiv.org" in HIGH_TRUST_DOMAINS
        assert "huggingface.co" in HIGH_TRUST_DOMAINS
        assert "openai.com" in HIGH_TRUST_DOMAINS
