"""Agent Opportunity Scan v0.1 - scores BPMS steps from Process Audit / Task Engine history.
Input CSV (one row per completed step instance), columns:
 process, step, step_type(user_task|service|gateway), instance_id, start_ts, end_ts, wait_min, work_min,
 outcome (e.g. approve/reject/route), input_key (hash of key business fields), loop_count, error(0/1)
Typical sources: PRA_PROCESS_STEP (+ PRA_STEP_LOGGED_FIELD for outcome/input), Task Engine audit (getTaskAudit / archive DB).
"""
import sys, pandas as pd, numpy as np
df = pd.read_csv(sys.argv[1], parse_dates=['start_ts','end_ts'])
months = max(1, (df.end_ts.max()-df.start_ts.min()).days/30.4)
rows=[]
for (p,s,t),g in df.groupby(['process','step','step_type']):
    n=len(g)/months
    top_share=g.outcome.value_counts(normalize=True).iloc[0] if g.outcome.notna().any() else np.nan
    # determinism: share of input_key groups where one outcome dominates (>=95%)
    det=np.nan
    if g.input_key.notna().any() and g.outcome.notna().any():
        k=g.groupby('input_key').outcome.agg(lambda x: x.value_counts(normalize=True).iloc[0])
        w=g.groupby('input_key').size()
        det=float((k>=0.95).mul(w).sum()/w.sum())
    rows.append(dict(process=p,step=s,type=t,per_month=round(n),work_min=g.work_min.mean(),wait_hrs=g.wait_min.mean()/60,
        top_outcome_share=top_share,determinism=det,rework=g.loop_count.gt(0).mean(),error_rate=g.error.mean()))
r=pd.DataFrame(rows)
r['human_hrs_month']=r.per_month*r.work_min/60
def cls(x):
    if x.type=='service' and x.error_rate>=0.05: return 'Integration fix'
    if x.type!='user_task': return 'Leave as is'
    if x.determinism>=0.8: return 'Rule candidate (ODM)'
    if x.top_outcome_share>=0.9 and x.work_min<=15: return 'Agent candidate (rubber-stamp)'
    if x.wait_hrs>=24 and x.top_outcome_share>=0.7: return 'Agent candidate (triage + human approve)'
    return 'Keep human'
r['class']=r.apply(cls,axis=1)
share={'Rule candidate (ODM)':0.8,'Agent candidate (rubber-stamp)':0.6,'Agent candidate (triage + human approve)':0.4}
r['hrs_saved_month']=r.human_hrs_month*r['class'].map(share).fillna(0)
r=r.sort_values(['hrs_saved_month','error_rate'],ascending=False)
pd.set_option('display.width',200)
print(r.round(2).to_string(index=False))
