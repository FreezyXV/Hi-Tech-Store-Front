import{d as m,r as a,j as s,L as h,E as x}from"./index-CpTpspq1.js";import{F as g}from"./Footer-DV8uS-8G.js";const f=()=>{const{categoryId:l}=m(),[t,c]=a.useState([]),[i,o]=a.useState(!0),[d,n]=a.useState(null);return a.useEffect(()=>{(async()=>{try{const r=await x(l);c(r)}catch(r){n(r.message)}finally{o(!1)}})()},[l]),i?s.jsx("div",{children:"Loading..."}):d?s.jsx("div",{className:"error-message",children:d}):s.jsxs("div",{className:"main-allproducts",children:[s.jsxs("div",{className:"all-models-page",children:[s.jsx("h1",{className:"page-title",children:"All Models"}),s.jsx("div",{className:"models-list",children:t.length>0?t.map(e=>s.jsx(h,{to:`/products/${l}/brands/${e.brandId}/models/${e._id}`,className:"model-card-link",children:s.jsxs("div",{className:"model-card",children:[s.jsx("img",{src:e.imageUrls||"https://via.placeholder.com/150",alt:e.name,className:"model-image"}),s.jsx("div",{className:"model-details",children:s.jsx("h2",{children:e.name})})]})},e._id)):s.jsx("div",{children:"No models available for this category."})})]}),s.jsx(g,{})]})};export{f as default};
