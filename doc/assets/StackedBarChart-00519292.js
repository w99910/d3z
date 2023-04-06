import{B as u}from"./BaseChart-63519ea0.js";import{o as m,c as f,a as p,b}from"./app-87afaaf0.js";class g extends u{constructor(t){super(t),this.options.fromColor="#e9c46a",this.options.toColor="#e76f51"}roundedCorner(t=5){return this.svg.selectAll("rect").attr("rx",t).attr("ry",t),this}data(t){return super.data(t)}build(){const t=[];this._data.forEach(i=>{i.data.forEach(c=>{t.push(c)})});const o=this.buildAxisBottom(t),e=this.buildAxisLeft(t),s=this.getColors(this._data.length),n=this;return this._data.forEach((i,c)=>{const l=i.name;this.svg.selectAll(`.bar.${l}`).data(i.data).join(a=>{a=a.append("rect").attr("class",`bar ${l}`).attr("x",function(r){return o(r.name)-c*10}).attr("width",o.bandwidth()),n.options.animation.enabled&&(a=a.attr("height",0).attr("y",function(r){return e(0)}).transition().duration(n.options.animation.duration)),a.attr("height",r=>n.height-e(r.value)).attr("y",function(r){return e(r.value)}).attr("fill",s[c]).delay(function(r,h){return h*10})},a=>{n.options.animation.enabled&&(a=a.transition().duration(n.options.animation.duration)),a.attr("y",function(r){return e(r.value)}).attr("height",r=>n.height-e(r.value))},a=>a.transition(400).attr("x",0).attr("y",0).attr("height",0).remove())}),this}}const _={id:"stackedbar-chart-demo",class:"w-full h-full flex flex-col"},B=b("div",{id:"stackedbar-chart",class:"w-1/2 h-4/6"},null,-1),v=[B],C={name:"StackedBarChart",setup(d){return m(()=>{const t=new g(document.getElementById("stackedbar-chart")),o=["Apple","Apple","Banana","Orange","Mango","Pineapple","Strawberry","Watermelon"],e=()=>{const s=[];for(let n of o)s.push({name:n,value:Math.floor(Math.random()*100)});return s};t.data([{name:"A",data:e()},{name:"B",data:e()}]).build().roundedCorner(2).pretty(),setInterval(()=>{t.update([{name:"A",data:e()},{name:"B",data:e()}]).pretty()},2e3)}),(t,o)=>(p(),f("div",_,v))}};export{C as default};