(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,31278,e=>{"use strict";let t=(0,e.i(75254).default)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);e.s(["Loader2",()=>t],31278)},43531,e=>{"use strict";let t=(0,e.i(75254).default)("Check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);e.s(["Check",()=>t],43531)},22198,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(25194),s=e.i(1928),i=e.i(43531),o=e.i(31278),d=e.i(75679);function l({productId:e,productName:l="",productPrice:n=0,className:c=""}){let{addToCart:h,cart:u}=(0,r.useCart)(),[m,b]=(0,a.useState)(!1),[f,g]=(0,a.useState)(!1),p=async()=>{b(!0);try{await h(e);let t=(u?.total||0)+n;u?.itemCount,(0,d.trackCartAdd)(e,l,1,n,t),g(!0),setTimeout(()=>g(!1),2e3)}catch(e){console.error("Failed to add to cart:",e)}finally{b(!1)}};return(0,t.jsx)("button",{onClick:p,disabled:m,className:`
        inline-flex items-center justify-center gap-2 
        px-6 py-3 
        bg-gradient-to-r from-amber-600 to-amber-700 
        text-white rounded-xl font-semibold 
        shadow-lg shadow-amber-600/25
        hover:from-amber-700 hover:to-amber-800 
        hover:shadow-xl hover:shadow-amber-600/30
        hover:-translate-y-0.5
        active:translate-y-0
        transition-all duration-200 ease-out
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
        ${f?"from-green-600 to-green-700 shadow-green-600/25":""}
        ${c}
      `,children:m?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.Loader2,{className:"h-5 w-5 animate-spin"}),(0,t.jsx)("span",{children:"Adding..."})]}):f?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(i.Check,{className:"h-5 w-5"}),(0,t.jsx)("span",{children:"Added!"})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.ShoppingCart,{className:"h-5 w-5"}),(0,t.jsx)("span",{children:"Add to Cart"})]})})}e.s(["default",()=>l])},70198,e=>{"use strict";var t=e.i(71645),a=e.i(75679);function r({productId:e,productName:r}){return(0,t.useEffect)(()=>{(0,a.trackProductView)(e,r)},[e,r]),null}e.s(["ProductTracker",()=>r])}]);