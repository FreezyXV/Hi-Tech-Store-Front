import{r,t as f,j as e,A as N}from"./index-CpTpspq1.js";/* empty css             */import{F as S}from"./Footer-DV8uS-8G.js";const E=()=>{const[a,d]=r.useState(""),[n,h]=r.useState(""),[l,m]=r.useState(""),[i,o]=r.useState(null),[t,g]=r.useState(""),x=f(),j=async s=>{var c,u;s.preventDefault(),o(null);try{await N({username:a,email:n,password:l}),alert("Registration successful"),x("/login")}catch(v){o(((u=(c=v.response)==null?void 0:c.data)==null?void 0:u.error)||"An unexpected error occurred.")}},p=s=>s.length<6?"Weak":s.match(/[A-Z]/)&&s.match(/[0-9]/)?"Strong":"Moderate";return e.jsxs("div",{className:"body",children:[e.jsx("div",{className:"register",children:e.jsxs("div",{className:"auth-container",children:[e.jsx("h1",{className:"auth-title",children:"Register"}),i&&e.jsx("div",{className:"error",children:i}),e.jsxs("form",{className:"auth-form",onSubmit:j,children:[e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Username:"}),e.jsx("input",{type:"text",value:a,onChange:s=>d(s.target.value),required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Email:"}),e.jsx("input",{type:"email",value:n,onChange:s=>h(s.target.value),required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{children:"Password:"}),e.jsx("input",{type:"password",value:l,onChange:s=>{m(s.target.value),g(p(s.target.value))},required:!0}),e.jsx("div",{className:`password-strength ${t.toLowerCase()}`,children:t&&`Strength: ${t}`})]}),e.jsx("button",{className:"auth-button",type:"submit",children:"Register"})]}),e.jsxs("p",{children:["Already have an account?"," ",e.jsx("a",{href:"/login",className:"login-link",children:"Log In"})]})]})}),e.jsx(S,{})]})};export{E as default};
