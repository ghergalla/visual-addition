const assert=require('node:assert/strict'),fs=require('node:fs'),Module=require('node:module');
const m=new Module('glyphs');m._compile(fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8').match(/<script id="addition-engine">([\s\S]*?)<\/script>/)[1],'glyphs.cjs');const M=m.exports;
let glyphFrames=0,matchedDots=0;
for(let n=0;n<10;n++)assert.equal(M.GLYPHS[n].pieces.length,n,'one connected ink piece per droplet');
for(const [a,b]of [[0,0],[1020,3040],[999,1],[9999,9999],[3716,2459],...Array.from({length:10},(_,n)=>[n,0])]){
 const model=M.build(a,b);
 for(const phase of model.phases.filter(f=>['expand','condense'].includes(f.kind))){
  for(let i=1;i<100;i++){
   const frame=M.sample(model,phase.start+phase.duration*i/100);
   for(const glyph of frame.glyphs){
    const paths=M.glyphPaths(glyph);
    assert.equal(paths.length,glyph.n);assert.equal(new Set(paths.map(p=>p.id)).size,glyph.n);
    assert.equal(new Set(glyph.parts.map(p=>p.index)).size,glyph.n);
    for(const path of paths){
     assert(!/NaN|Infinity/.test(path.path));assert(path.path.endsWith('Z'));
     const dot=frame.points.find(d=>d.id===path.id);
     assert(Math.abs(dot.dx-path.x)<1e-9&&Math.abs(dot.y-glyph.homeY-path.y)<1e-9);
     matchedDots++;
    }
    if(glyph.n===0)assert.equal(paths.length,0,'zero never creates a droplet');
    glyphFrames++;
   }
  }
 }
}
console.log(JSON.stringify({passed:true,glyphFrames,matchedDots,allNumerals:true,zeroCreatesNoDots:true}));
