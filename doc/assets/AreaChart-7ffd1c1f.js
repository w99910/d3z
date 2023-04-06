import{B as A}from"./BaseChart-e18bee46.js";import{w as C,c as l,a as E}from"./array-95b0a04c.js";import{c as M,x as k,y as D,l as y}from"./line-cb80fc4f.js";import{o as P,c as S,a as X,b as Y}from"./app-73dc2e3c.js";function z(o,r,a){var c=null,u=l(!0),s=null,f=M,e=null,B=C(n);o=typeof o=="function"?o:o===void 0?k:l(+o),r=typeof r=="function"?r:r===void 0?l(0):l(+r),a=typeof a=="function"?a:a===void 0?D:l(+a);function n(t){var i,b,h,p=(t=E(t)).length,d,m=!1,v,w=new Array(p),x=new Array(p);for(s==null&&(e=f(v=B())),i=0;i<=p;++i){if(!(i<p&&u(d=t[i],i,t))===m)if(m=!m)b=i,e.areaStart(),e.lineStart();else{for(e.lineEnd(),e.lineStart(),h=i-1;h>=b;--h)e.point(w[h],x[h]);e.lineEnd(),e.areaEnd()}m&&(w[i]=+o(d,i,t),x[i]=+r(d,i,t),e.point(c?+c(d,i,t):w[i],a?+a(d,i,t):x[i]))}if(v)return e=null,v+""||null}function g(){return y().defined(u).curve(f).context(s)}return n.x=function(t){return arguments.length?(o=typeof t=="function"?t:l(+t),c=null,n):o},n.x0=function(t){return arguments.length?(o=typeof t=="function"?t:l(+t),n):o},n.x1=function(t){return arguments.length?(c=t==null?null:typeof t=="function"?t:l(+t),n):c},n.y=function(t){return arguments.length?(r=typeof t=="function"?t:l(+t),a=null,n):r},n.y0=function(t){return arguments.length?(r=typeof t=="function"?t:l(+t),n):r},n.y1=function(t){return arguments.length?(a=t==null?null:typeof t=="function"?t:l(+t),n):a},n.lineX0=n.lineY0=function(){return g().x(o).y(r)},n.lineY1=function(){return g().x(o).y(a)},n.lineX1=function(){return g().x(c).y(r)},n.defined=function(t){return arguments.length?(u=typeof t=="function"?t:l(!!t),n):u},n.curve=function(t){return arguments.length?(f=t,s!=null&&(e=f(s)),n):f},n.context=function(t){return arguments.length?(t==null?s=e=null:e=f(s=t),n):s},n}class I extends A{build(){const r=this.buildAxisBottom(),a=this.buildAxisLeft(),c=z().x(function(e){return r(e.name)}).y0(a(0)).y1(function(e){return a(e.value)});y().x(function(e){return r(e.name)}).y(function(e){return a(e.value)});let u=this.svg.select("path.area");if(!u.empty()){u.attr("clip-path",null),this.options.animation.enabled&&(u=u.transition().duration(this.options.animation.duration)),u.attr("d",c(this._data));return}const f=this.svg.append("clipPath").attr("id","clip").append("rect").attr("width",0).attr("height",this.height);return this.svg.append("path").attr("class","area").attr("fill",this.options.fillColor??"#a2d2ff").attr("clip-path","url(#clip)").attr("d",c(this._data)),f.transition().duration(this.options.animation.duration).attr("width",this.width),this}}const L={id:"area-chart-demo",class:"w-full h-full flex flex-col"},R=Y("div",{id:"area-chart",class:"w-full h-1/2"},null,-1),j=[R],F={name:"AreaChart",setup(o){return P(()=>{const r=new I(document.getElementById("area-chart")),a=(u=20)=>{const s=[];for(let f=0;f<=u;f++)s.push({name:new Date(new Date-Math.random()*1e12),value:Math.floor(Math.random()*100)});return s},c=a();r.data(c).build().pretty(),setInterval(()=>{r.update(a(20)).pretty()},2e3)}),(r,a)=>(X(),S("div",L,j))}};export{F as default};
