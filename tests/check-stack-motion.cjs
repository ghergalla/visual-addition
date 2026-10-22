const assert=require('node:assert/strict'),fs=require('node:fs'),Module=require('node:module');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const mod=new Module('stack-motion');
mod._compile(html.match(/<script id="addition-engine">([\s\S]*?)<\/script>/)[1],'stack-motion.cjs');
const M=mod.exports;
const cases=[[3716,2459],[9999,9999],[9999,1],[999,1],[0,0],[9090,909]];
// Every digit pair, both without and with a carry arriving from the ones.
for(let a=0;a<10;a++)for(let b=0;b<10;b++)cases.push([a,b],[10*a+9,10*b+1]);
let frames=0,routes=0,carries=0,minGap=Infinity;
function balanced(points){
  const stacks=[-M.GAP,0,M.GAP].map(x=>points.filter(d=>Math.abs(d.dx-x)<.001).sort((a,b)=>b.y-a.y));
  const heights=stacks.map(s=>s.length);
  assert(Math.max(...heights)-Math.min(...heights)<=1,'stack heights differ by at most one');
  for(const stack of stacks)stack.forEach((d,i)=>assert(Math.abs(d.y-(M.BASE+M.GAP-i*M.GAP))<.001,'no holes below a settled dot'));
}
for(const [a,b]of cases){
  const model=M.build(a,b),columnPhases=model.phases.filter(f=>Number.isInteger(f.p));
  assert.deepEqual(columnPhases.map(f=>f.p),columnPhases.map(f=>f.p).sort((a,b)=>a-b),'finish each column before moving left');
  for(const f of model.phases){
    if(f.kind==='gather'){
      const plan=f.fallPlan,arrivals=Object.values(plan.routes),settled=Object.values(f.from).filter(d=>d.p===f.p&&d.y>=M.BASE-M.GAP);
      balanced(settled);
      let lastEnd=-Infinity;
      for(const route of arrivals){
        assert(route.end>lastEnd,'successive slots settle in bottom-up order');lastEnd=route.end;
        const points=route.path.points,goal=points.at(-1);
        points.forEach((q,i)=>{
          if(i)assert(q.y>=points[i-1].y-1e-9,'falling paths never descend below a slot and loop back');
          assert(q.y<=goal.y+1e-9,'no overshoot below the resting position');
          assert(Math.abs(q.x)<=M.GAP+3.001,'stay within the three subcolumns');
        });
        if(goal.y>=M.BASE-M.GAP){settled.push({dx:goal.x,y:goal.y});balanced(settled);}
        const midBounce=M.plannedPoint(plan,route.id,route.start+(route.end-route.start)*.92);
        assert(goal.y-midBounce.y>0&&goal.y-midBounce.y<3,'one small upward settling bounce');
        routes++;
      }
    }
    if(f.kind==='carry'){
      const dest=f.to[f.bigId];
      assert.equal(dest.p,f.p+1);
      assert(dest.y<=M.TOP+M.GAP,'carry lands in the upper field first');
      const upper=Object.values(f.to).filter(d=>d.p===f.p+1&&d.y<M.WAITING).map(d=>({...d,y:d.y+M.BASE-M.TOP}));
      balanced(upper);
      assert.equal(dest.r,M.R);
      const fall=model.phases.find(next=>next.start>=f.end&&next.kind==='gather'&&next.fallPlan.routes[f.bigId]);
      assert(fall,'carried dot later falls within its new column');
      assert.equal(fall.p,f.p+1);
      carries++;
    }
    if(!['gather','carry'].includes(f.kind))continue;
    for(let i=0;i<=180;i++)for(const narrow of [true,false]){
      const scene=M.sample(model,f.start+f.duration*i/180,false,narrow),points=scene.points.filter(d=>d.r>.001&&d.alpha>.001),width=(narrow?564:832)/scene.layout;
      for(let j=0;j<points.length;j++){
        const d=points[j];
        if(f.kind==='gather'&&d.p!==f.p||f.kind==='carry'&&d.id!==f.bigId){
          assert(Math.abs(d.dx-f.from[d.id].dx)<1e-8,'unrelated dots stay still');
          assert(Math.abs(d.y-f.from[d.id].y)<1e-8,'unrelated dots stay still');
        }
        for(let k=0;k<j;k++){
          const other=points[k],gap=Math.hypot((other.p-d.p)*width+d.dx-other.dx,d.y-other.y)-d.r-other.r;
          minGap=Math.min(minGap,gap);
          assert(gap>.6,`dots stay separated: ${a}+${b}, ${f.kind}, ${i}/180`);
        }
      }
      frames++;
    }
  }
}
console.log(JSON.stringify({passed:true,cases:cases.length,frames,routes,carries,minimumSurfaceGap:minGap}));
