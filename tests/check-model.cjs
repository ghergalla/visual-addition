const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const engine=html.match(/<script id="addition-engine">([\s\S]*?)<\/script>/)[1];
const Module=require('node:module'),mod=new Module('addition-model');mod._compile(engine,'addition-model.cjs');
const M=mod.exports;
const cases=[[3716,2459],[999,1],[9999,9999],[0,0],[0,9999],[9999,1],[123,456],[4,5],[5,4],[1000,9000],[9090,909],[1,9999]];
for(let a=0;a<=9;a++)for(let b=0;b<=9;b++)cases.push([a,b]);
let seed=12345;function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%10000;}
for(let i=0;i<500;i++)cases.push([random(),random()]);
let boundaryChecks=0;
const value=state=>Object.values(state).reduce((v,d)=>v+d.weight*Math.pow(10,d.p),0);
for(const [a,b]of cases){
 const m=M.build(a,b);
 assert.equal(m.sum,a+b);
 assert.equal(m.finalCounts.reduce((v,n,p)=>v+n*Math.pow(10,p),0),a+b);
 assert(m.finalCounts.every(n=>n>=0&&n<10));
 assert.equal(m.finalLayout,a+b>9999?5:4);
 assert.equal(M.sample(m,0).points.length,0);
 assert.equal(M.sample(m,m.total).original,1);
 assert.equal(M.sample(m,m.total).answer,1);
 assert.equal(M.sample(m,m.total).answerY,438);
 const carrying=m.phases.filter(p=>p.kind==='carry').map(p=>p.p);
 assert.deepEqual(carrying,carrying.slice().sort((a,b)=>a-b));
 for(const p of m.phases){
  assert.equal(value(p.from),a+b,p.kind+' from conservation');
  assert.equal(value(p.to),a+b,p.kind+' to conservation');
  const s=M.sample(m,p.end);
  if(p.kind==='bundle'){
   assert(Math.abs(p.to[p.bigId].r**2-10*M.R**2)<1e-8);
   assert.equal(p.selected.length,10);
  }
  if(p.kind==='carry'){
   assert.equal(p.to[p.bigId].p,p.p+1);
   assert.equal(p.to[p.bigId].r,M.R);
   assert.equal(p.to[p.bigId].color,M.COLORS[p.p+1]);
  }
  for(const fraction of [0,.13,.3,.5,.78,1]){
   const sample=M.sample(m,p.start+(p.duration*fraction));
   for(const d of sample.points){
    assert(Number.isFinite(d.dx)&&Number.isFinite(d.y)&&Number.isFinite(d.r));
    assert(d.r>=0&&d.r<=Math.sqrt(10)*M.R+.001);
    assert(d.alpha>=0&&d.alpha<=1);
    if(p.kind==='gather'&&d.id.includes('-b-')){
     assert.equal(d.dx,p.from[d.id].dx,'lower dots stay anchored during gathering');
     assert.equal(d.y,p.from[d.id].y,'lower dots stay anchored during gathering');
    }
    if(p.kind==='carry'&&d.id!==p.bigId&&d.p===p.p+1){
     assert.equal(d.dx,p.from[d.id].dx,'receiving dots stay anchored during carrying');
     assert.equal(d.y,p.from[d.id].y,'receiving dots stay anchored during carrying');
    }
   }
   // A second call at the same time must reproduce the exact frame.
   assert.deepEqual(sample,M.sample(m,p.start+p.duration*fraction));
  }
  if(p.end<m.total){
   const after=M.sample(m,p.end+1e-6);
   assert(Math.abs(s.layout-after.layout)<.001);
   const x=new Map(s.points.filter(d=>d.r>.01&&d.alpha>.001).map(d=>[d.id,d]));
   const y=new Map(after.points.filter(d=>d.r>.01&&d.alpha>.001).map(d=>[d.id,d]));
   assert.equal(x.size,y.size,'dot count is continuous');
   for(const [id,d]of x){
    assert(y.has(id),'dot identity is continuous '+p.kind);
    const next=y.get(id);
    assert(Math.abs(d.dx-next.dx)<.01&&Math.abs(d.y-next.y)<.01&&Math.abs(d.r-next.r)<.01,'position continuous '+p.kind);
   }
   boundaryChecks++;
  }
 }
}
assert.throws(()=>M.build(-1,3));assert.throws(()=>M.build(1.1,3));assert.throws(()=>M.build(10000,3));
const example=M.build(3716,2459);
assert.deepEqual(example.finalCounts,[5,7,1,6,0]);
assert.deepEqual(example.phases.filter(p=>p.kind==='carry').map(p=>p.p),[0,2]);
const chain=M.build(999,1);
assert.deepEqual(chain.phases.filter(p=>p.kind==='carry').map(p=>p.p),[0,1,2]);
const nine=M.build(4,5).gathered;
assert.equal(Object.values(nine).filter(d=>d.y>=M.BASE-M.GAP&&d.y<=M.BASE+M.GAP).length,9);
console.log(JSON.stringify({passed:true,additionCases:cases.length,boundaryChecks,defaultSum:example.sum,defaultDuration:example.total,chainCarries:3,maxSum:M.build(9999,9999).sum}));

