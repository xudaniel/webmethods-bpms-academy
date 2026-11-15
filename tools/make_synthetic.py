import pandas as pd, numpy as np
rng=np.random.default_rng(7); rows=[]
spec=[('Shipment exception','Review delay claim','user_task',1800,12,6,'approve',0.94,0.5),
      ('Shipment exception','Assign carrier credit','user_task',900,8,30,'approve',0.97,0.9),
      ('Shipment exception','Escalate to manager','user_task',120,25,48,'approve',0.6,0.2),
      ('Shipment exception','Call TMS update','service',2700,0,0,None,None,None),
      ('Customs hold','Classify documents','user_task',600,20,36,'route_A',0.75,0.3),
      ('Customs hold','Release approval','user_task',600,6,20,'approve',0.92,0.85)]
for proc,step,t,n,work,wait,top,share,detf in spec:
    for i in range(n*6):
        st=pd.Timestamp('2026-04-01')+pd.Timedelta(minutes=int(rng.integers(0,6*30*24*60)))
        out=None; key=None
        if top:
            key=f'k{rng.integers(0,40)}'
            det=int(key[1:])<40*detf
            out=top if (det or rng.random()<share) else 'reject'
        rows.append(dict(process=proc,step=step,step_type=t,instance_id=i,start_ts=st,end_ts=st+pd.Timedelta(minutes=work+wait*60),
           wait_min=max(0,rng.normal(wait*60,wait*10)),work_min=max(1,rng.normal(work,work*0.3)) if t=='user_task' else 0,
           outcome=out,input_key=key,loop_count=int(rng.random()<0.08),error=int(t=='service' and rng.random()<0.07)))
pd.DataFrame(rows).to_csv('synthetic_audit.csv',index=False)
