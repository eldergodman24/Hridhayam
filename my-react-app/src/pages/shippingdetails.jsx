import {useEffect , React} from 'react';

const ShippingDetails = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return(<div className='w-full h-full flex flex-col justify-center items-center gap-10 py-24'>
        <h1 className='font-[cinzel] font-[500] text-4xl text-black'>SHIPPING, RETURN, REFUND AND CANCELLATION POLICY</h1>
        <p className='font-[lato] text-[#41444B] w-3/4'>Welcome to Hridayam – Fashion and Jewelry for Everyone :- 
        At Hridayam, we aim to provide a smooth and transparent shopping experience. Please read
our policies below to understand how we handle shipping, returns, refunds, and cancellations. </p>
        <h1 className='font-[cinzel] font-[500] text-3xl text-black'>Shipping Policy :</h1>
        <p className='font-[lato] text-[#41444B] w-3/4'>Processing Time: Orders are typically processed within 1–3 business days.
Delivery Time:
Domestic (India): 4–7 business days
International: 10–15 business days (availability varies).</p>
<h1 className='font-[cinzel] font-[500] text-3xl text-black'>Shipping Changes :</h1>
        <p className='font-[lato] text-[#41444B] w-3/4'>Free shipping on orders above ₹50,000 (within India)
Standard rates apply for international orders, shown at checkout
Order Tracking: Once dispatched, you’ll receive a tracking link via email/SMS.
Note: Delivery timelines may vary during festive seasons, public holidays, or due to
unforeseen circumstances..</p>
  
        <h1 className='font-[cinzel] font-[500] text-3xl text-black'>Return & Exchange Policy :</h1>
        <p className='font-[lato] text-[#41444B] w-3/4'>We want you to love your purchase. If you’re not fully satisfied:
        Return Eligibility:
        Return request must be raised within 7 days of delivery
Items must be unused, unworn, and in original packaging
Not Eligible for Return:
Customized or made-to-order products
Earrings (for hygiene reasons)
Sale items (unless defective)
Exchange: You can request a size exchange (for apparel) or replacement (for damaged items),
subject to availability
To request a return/exchange, email us at hridhayamjewels@gmail.com with your order number and reason.</p>

        <h1 className='font-[cinzel] font-[500] text-3xl text-black'>Refund Policy :</h1>
        <p className='font-[lato] text-[#41444B] w-3/4'>Refunds are initiated after we receive and inspect the returned item
Amount will be refunded to your original payment method within 5–7 business days
If payment was made via Cash on Delivery (COD), refunds will be processed via bank transfer
or store credit
 Shipping charges (if any) are non-refundable unless the return is due to a defective or wrong
item.</p>
    
            <h1 className='font-[cinzel] font-[500] text-3xl text-black'>Order Cancellation Policy :</h1>
            <p className='font-[lato] text-[#41444B] w-3/4'>Orders can be cancelled within 12 hours of placement or before shipment
To cancel, email us at hridhayamjewels@gmail.com with your order number
Once dispatched, cancellations are not possible—you may initiate a return after delivery.</p>
</div>
    )
}

export default ShippingDetails;
