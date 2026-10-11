import React,{useEffect,useState} from "react"; import {Link,useParams} from "react-router-dom"; import {api,Button,Card,Shell,imageUrl,money,getError,safeArray} from "./_pageUtils";
export default function ProductDetailsPage(){const {id}=useParams();const [p,setP]=useState(null);const [related,setRelated]=useState([]);const [qty,setQty]=useState(1);const [error,setError]=useState("");const [reviewMessage,setReviewMessage]=useState("");const [reviewRating,setReviewRating]=useState(5);const [reviewBusy,setReviewBusy]=useState(false);const [wishlist,setWishlist]=useState(false);useEffect(()=>{api.get(`/product/get-product/${id}`).then(r=>setP(r.data.product)).catch(e=>setError(getError(e)));},[id]);useEffect(()=>{if(p){const w=JSON.parse(localStorage.getItem("eshop_wishlist")||"[]");setWishlist(w.some(x=>x._id===p._id));}},[p]);useEffect(()=>{if(p?.category)api.get(`/product/get-all-products?category=${encodeURIComponent(p.category)}`).then(r=>setRelated(safeArray(r.data.products).filter(x=>x._id!==p._id).slice(0,4))).catch(()=>{});},[p]);if(error)return <Shell title="Product"><Card className="text-red-600">{error}</Card></Shell>;if(!p)return <Shell title="Product"><div className="h-96 animate-pulse rounded-3xl bg-white"/></Shell>;return <Shell back><div className="grid gap-8 lg:grid-cols-2"><Card className="p-3"><img src={imageUrl(p.images?.[0])} alt={p.name} className="h-[520px] w-full rounded-2xl object-cover"/></Card><div className="py-3"><span className="text-sm font-semibold text-primary">{p.category}</span><h1 className="mt-2 font-poppins text-4xl font-extrabold text-secondary">{p.name}</h1><div className="mt-5 flex items-end gap-3"><span className="font-poppins text-3xl font-bold text-secondary">{money(p.discountPrice)}</span>{p.originalPrice&&<del className="text-gray-400">{money(p.originalPrice)}</del>}</div><p className="mt-6 whitespace-pre-line text-sm leading-7 text-gray-600">{p.description}</p><div className="mt-7 flex items-center gap-3"><button onClick={()=>setQty(Math.max(1,qty-1))} className="h-11 w-11 rounded-xl border">−</button><span className="w-8 text-center font-semibold">{qty}</span><button onClick={()=>setQty(qty+1)} className="h-11 w-11 rounded-xl border">+</button><Button
  className="ml-2 flex-1"
  disabled={!p.stock || qty > Number(p.stock)}
  onClick={() => {
    const current = JSON.parse(localStorage.getItem("eshop_cart") || "[]");
    const existing = current.find((item) => item._id === p._id);
    const nextQty = (existing?.qty || 0) + qty;

    if (nextQty > Number(p.stock)) {
      setError("Requested quantity exceeds available stock.");
      return;
    }

    const next = existing
      ? current.map((item) =>
          item._id === p._id ? { ...item, qty: nextQty } : item
        )
      : [...current, { ...p, qty }];

    localStorage.setItem("eshop_cart", JSON.stringify(next));
    setError("");
  }}
>
  Add to Cart
</Button></div><div className="mt-5 flex flex-wrap gap-3">
<button type="button" className="rounded-xl border border-primary px-4 py-3 text-sm font-semibold text-primary" onClick={async()=>{try{const r=await api.post("/conversation/create-new-conversation",{sellerId:p.shopId,groupTitle:`Chat about ${p.name}`});window.location.href=`/inbox?conversation=${r.data.conversation?._id||""}`;}catch(e){setError(getError(e));}}}>Contact Seller</button>
<button type="button" className="rounded-xl border px-4 py-3 text-sm font-semibold" onClick={()=>{const w=JSON.parse(localStorage.getItem("eshop_wishlist")||"[]");const next=wishlist?w.filter(x=>x._id!==p._id):[...w,p];localStorage.setItem("eshop_wishlist",JSON.stringify(next));setWishlist(!wishlist);}}>{wishlist?"♥ Remove from Wishlist":"♡ Add to Wishlist"}</button>
<Link to="/wishlist" className="rounded-xl border px-4 py-3 text-sm font-semibold">View Wishlist</Link>
</div><div className="mt-7 grid grid-cols-2 gap-3"><Card><p className="text-xs text-gray-400">Stock</p><p className="mt-1 font-bold text-secondary">{p.stock ?? 0}</p></Card><Card><p className="text-xs text-gray-400">Rating</p><p className="mt-1 font-bold text-secondary">★ {Number(p.ratings||0).toFixed(1)}</p></Card></div></div></div><section className="mt-12"><Card><h2 className="font-poppins text-2xl font-bold text-secondary">Customer Reviews</h2>{p.reviews?.length?<div className="mt-5 space-y-4">{p.reviews.map((r,i)=><div key={r._id||i} className="border-b pb-4 last:border-b-0"><div className="flex justify-between"><b>{r.user?.name||"Customer"}</b><span>★ {r.rating}</span></div><p className="mt-2 text-sm text-gray-600">{r.message}</p></div>)}</div>:<p className="mt-4 text-sm text-gray-500">No reviews yet.</p>}<div className="mt-7 border-t pt-6"><h3 className="font-semibold">Write a review</h3><div className="mt-3 flex gap-2">{[1,2,3,4,5].map(n=><button type="button" key={n} onClick={()=>setReviewRating(n)} className={n<=reviewRating?"text-xl text-yellow-500":"text-xl text-gray-300"}>★</button>)}</div><textarea className="input-field mt-3 min-h-28" value={reviewMessage} onChange={e=>setReviewMessage(e.target.value)} placeholder="Share your experience..." /><Button disabled={reviewBusy||!reviewMessage.trim()} className="mt-3" onClick={async()=>{setReviewBusy(true);setError("");try{const r=await api.post(`/product/add-review/${p._id}`,{rating:reviewRating,message:reviewMessage.trim()});setP(r.data.product);setReviewMessage("");setReviewRating(5);}catch(e){setError(getError(e));}finally{setReviewBusy(false);}}}>{reviewBusy?"Submitting...":"Submit Review"}</Button></div></Card></section>{related.length>0&&<section className="mt-12"><h2 className="section-title">You may also like</h2><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map(x=><div key={x._id}><Link to={`/product/${x._id}`}><img src={imageUrl(x.images?.[0])} className="h-48 w-full rounded-2xl object-cover" alt={x.name}/><h3 className="mt-3 font-semibold text-secondary">{x.name}</h3></Link></div>)}</div></section>}</Shell>}
