import{B as l}from"./BaseChart-63519ea0.js";import{r as u,d,e as c,o as h,c as f,a as p,b as m}from"./app-87afaaf0.js";class b extends l{roundedCorner(r=5){return this.svg.selectAll("rect").attr("rx",r).attr("ry",r),this}build(){const r=this.buildAxisBottom(),n=this.buildAxisLeft();let o=this.svg.selectAll(".bar").data(this._data),e=this;return o.join(t=>(t=t.append("rect").attr("class","bar").attr("x",function(a){return r(a.name)}).attr("width",r.bandwidth()),e.options.animation.enabled&&(t=t.attr("height",0).attr("y",function(a){return n(0)}).transition().duration(e.options.animation.duration)),t.attr("height",a=>e.height-n(a.value)).attr("y",function(a){return n(a.value)}).attr("fill",e.options.fillColor??"#72aaff").delay(function(a,i){return i*10}),t),t=>{e.options.animation.enabled&&(t=t.transition().duration(e.options.animation.duration)),t.attr("y",function(a){return n(a.value)}).attr("height",a=>e.height-n(a.value))},t=>t.transition(400).attr("x",0).attr("y",0).attr("height",0).remove()),this}}const v={id:"bar-chart-demo",class:"w-full h-full flex flex-col"},g=m("div",{id:"bar-chart",class:"w-full h-1/2"},null,-1),_=[g],y={name:"BarChart",setup(s){const r=u(!0);return d(()=>{r.value=!0}),c(()=>{r.value=!1}),h(()=>{let n=new b(document.getElementById("bar-chart"));const o=["Apple","Apple","Banana","Orange","Mango","Pineapple","Strawberry","Watermelon"],e=()=>{const a=[];for(let i of o)a.push({name:i,value:Math.floor(Math.random()*100)});return a},t=e();n.data(t).margin({top:40,bottom:60,left:40}).build().pretty(),setInterval(()=>{r.value&&n.update(e()).pretty()},3e3)}),(n,o)=>(p(),f("div",v,_))}};export{y as default};