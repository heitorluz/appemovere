"""
Simulation: false-insight rate and power of the insight-engine rules
(see docs/product/08-insights-and-ai.md and SP-06 in docs/product/07-clinical-safety.md).
Written in October 2026 to compare candidate rules before implementing them.

Questions:
  1. Among people with NO real pattern in their entries, how many would see at least
     one FALSE insight? (false-insight rate)
  2. Among people WITH a real pattern, how many would see it? (power)
  3. Of the insights shown, what share would be true? (precision)

Assumptions — 100% synthetic data; good for orders of magnitude, not for calibration:
  - Daily outcome (e.g., anxiety 0-10): mean 5, standard deviation 1.8, autocorrelation 0.4 between days.
  - Binary daily factor (e.g., "slept less than 6 h"), frequency p, persistence 0.3.
  - The person logs on 85% of the days, and missing days are random.
  - K independent factor x outcome pairs (worst case for multiple comparisons).
  - "Effect" = real difference, in points, between days with and without the factor.
Not covered: missing days concentrated on bad days, weekly cycles, reverse causation.

Usage: python3 false-insight-simulation.py   (requires numpy; takes a few minutes)

The canonical version will live in the AI lab repository (spec insight-simulation, ADR-030);
the app ports the chosen rule as a test (SP-22).
"""
import numpy as np

T = 168  # 24 weeks
PHI, SD, MEAN, PERSIST, COMPLIANCE = 0.4, 1.8, 5.0, 0.3, 0.85
N_USERS = 20000

# win = days per window; reps = consecutive windows that must agree;
# n_min = minimum days per group in each window; d_min = minimum difference; cad = days between evaluations
RULES = {
    "A 2x14 days, n>=5, every week":       dict(win=14, reps=2, n_min=5, d_min=1.5, cad=7),
    "B 2x14 days, n>=5, every 14 days":    dict(win=14, reps=2, n_min=5, d_min=1.5, cad=14),
    "C 2x21 days, n>=6, every 21 days":    dict(win=21, reps=2, n_min=6, d_min=1.5, cad=21),
    "D 2x28 days, n>=6, every 28 days":    dict(win=28, reps=2, n_min=6, d_min=1.5, cad=28),
    "E 2x28 days, n>=8, every 28 days":    dict(win=28, reps=2, n_min=8, d_min=1.5, cad=28),
}


def simulate(k, p, effect, rng):
    eps = rng.normal(0, SD * np.sqrt(1 - PHI**2), size=(N_USERS, T))
    x = np.empty((N_USERS, T))
    x[:, 0] = rng.normal(0, SD, size=N_USERS)
    for t in range(1, T):
        x[:, t] = PHI * x[:, t - 1] + eps[:, t]
    f = np.empty((N_USERS, k, T), dtype=np.int8)
    f[:, :, 0] = rng.random((N_USERS, k)) < p
    for t in range(1, T):
        prob = np.where(f[:, :, t - 1] == 1, p + PERSIST * (1 - p), p * (1 - PERSIST))
        f[:, :, t] = rng.random((N_USERS, k)) < prob
    a = np.clip(np.rint(MEAN + x + effect * f[:, 0, :]), 0, 10)  # the real effect only exists in pair 0
    logged = rng.random((N_USERS, T)) < COMPLIANCE
    return a, f, logged


def difference(a, f, logged, start, end):
    L = logged[:, None, start:end].astype(float)
    F = f[:, :, start:end].astype(float)
    A = a[:, None, start:end]
    n1, n0 = (F * L).sum(-1), ((1 - F) * L).sum(-1)
    with np.errstate(divide="ignore", invalid="ignore"):
        d = (A * F * L).sum(-1) / n1 - (A * (1 - F) * L).sum(-1) / n0
    return n1, n0, d


def evaluate(rule, a, f, logged, day):
    valid = hit = sign = None
    for r in range(rule["reps"]):
        n1, n0, d = difference(a, f, logged, day - (r + 1) * rule["win"], day - r * rule["win"])
        v = (n1 >= rule["n_min"]) & (n0 >= rule["n_min"])
        h = np.abs(d) >= rule["d_min"]
        s = np.sign(d)
        valid = v if valid is None else valid & v
        hit = h if hit is None else hit & h & (s == sign)
        sign = s
    return valid, valid & hit


def run(rule, k, p, effect, seed=7):
    rng = np.random.default_rng(seed)
    a, f, logged = simulate(k, p, effect, rng)
    first = rule["win"] * rule["reps"]
    seen12 = np.zeros((N_USERS, k), bool)
    seen24 = np.zeros((N_USERS, k), bool)
    evaluable = []
    for day in range(first, T + 1, rule["cad"]):
        valid, insight = evaluate(rule, a, f, logged, day)
        if day <= 84:
            seen12 |= insight
        seen24 |= insight
        evaluable.append(valid.mean())
    return seen12, seen24, 100 * float(np.mean(evaluable)), first


if __name__ == "__main__":
    for name, rule in RULES.items():
        print(f"\n### Rule {name} (minimum difference {rule['d_min']})")
        for p in (0.3, 0.5):
            fp = {}
            for k in (1, 4, 8):
                v12, v24, evaluable, first = run(rule, k, p, 0.0)
                fp[k] = (100 * v12.any(axis=1).mean(), 100 * v24.any(axis=1).mean())
            power = {}
            for effect in (1.0, 1.5, 2.5):
                v12, v24, _, _ = run(rule, 1, p, effect)
                power[effect] = (100 * v12[:, 0].mean(), 100 * v24[:, 0].mean())
            # precision: of the insights shown over 24 weeks, % true, if 20% of the tested pairs are real (effect 1.5)
            precision = 100 * 0.2 * power[1.5][1] / (0.2 * power[1.5][1] + 0.8 * fp[1][1])
            print(f"  factor present on {int(p*100)}% of days | first possible insight on day {first} | pair evaluable in {evaluable:.0f}% of evaluations")
            print(f"    false insight (12 wk / 24 wk): 1 pair {fp[1][0]:.1f}% / {fp[1][1]:.1f}% | 4 pairs {fp[4][0]:.1f}% / {fp[4][1]:.1f}% | 8 pairs {fp[8][0]:.1f}% / {fp[8][1]:.1f}%")
            print(f"    power (12 wk / 24 wk): effect 1.0 = {power[1.0][0]:.0f}% / {power[1.0][1]:.0f}% | effect 1.5 = {power[1.5][0]:.0f}% / {power[1.5][1]:.0f}% | effect 2.5 = {power[2.5][0]:.0f}% / {power[2.5][1]:.0f}%")
            print(f"    precision of the insights shown (if 20% of pairs are real, effect 1.5): {precision:.0f}%")
