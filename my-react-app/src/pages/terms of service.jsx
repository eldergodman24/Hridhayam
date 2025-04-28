import React from 'react';
import { Link } from 'react-router-dom';

const Termsofservice = () => {
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return(<div className='w-full h-full flex flex-col justify-center items-center gap-10 py-24'>
        <h1 className='font-[cinzel] font-[500] text-4xl text-black'>TERMS AND CONDITIONS</h1>
        <p className='font-[lato] text-[#41444B] w-3/4'>Welcome to Hridayam – Jewelry for Everyone
These Terms & Conditions govern your use of our website <a href="https://hridhayam.in/">Hridhayam</a> and services. By
accessing or using our site, you agree to be bound by these terms. If you do not agree, please
do not use our website. </p>
        <h1 className='font-[cinzel] font-[500] text-3xl text-black'>1. Use of Our Website </h1>
        <p className='font-[lato] text-[#41444B] w-3/4'>You agree to use our website for lawful purposes only and in a way that does not infringe the
rights of others or restrict anyone else’s enjoyment of the site.
You must be at least 18 years old to make a purchase
You are responsible for maintaining the confidentiality of your account and password
Hridayam reserves the right to refuse service, terminate accounts, or cancel orders at our
discretion.</p>
        <h1 className='font-[cinzel] font-[500] text-3xl text-black'>2. Product Information </h1>
        <p className='font-[lato] text-[#41444B] w-3/4'>We strive to display accurate product descriptions, prices, and availability. However:
Colors may vary slightly due to screen differences
Prices are subject to change without notice
We reserve the right to limit quantities or discontinue items.</p>
        <h1 className='font-[cinzel] font-[500] text-3xl text-black'>3. Orders & Payments </h1>
        <p className='font-[lato] text-[#41444B] w-3/4'>Orders are confirmed only after successful payment
We accept major credit/debit cards and online wallets via secure payment gateways
In case of pricing errors, we may cancel your order and issue a full refund.</p>
            <h1 className='font-[cinzel] font-[500] text-3xl text-black'>4. Shipping & Delivery</h1>
        <p className='font-[lato] text-[#41444B] w-3/4'>Delivery timelines are estimated and may vary based on location and logistics
Shipping fees and policies are listed during checkout
Hridayam is not responsible for delays caused by courier services or natural disruptions.</p>
            <h1 className='font-[cinzel] font-[500] text-3xl text-black'> 5. Returns & Exchanges </h1>
        <p className='font-[lato] text-[#41444B] w-3/4'>We offer returns/exchanges subject to our Return Policy
Items must be unused and in original packaging
Customized or personalized products may not be eligible for return.</p>
            <h1 className='font-[cinzel] font-[500] text-3xl text-black'>6. Intellectual Property </h1>
        <p className='font-[lato] text-[#41444B] w-3/4'>All content on this website—including images, logos, text, and designs—is the property of
        Hridayam or licensed to us. You may not reproduce or use it without our permission.</p>
            <h1 className='font-[cinzel] font-[500] text-3xl text-black'>7. User Content </h1>
        <p className='font-[lato] text-[#41444B] w-3/4'>If you post reviews, feedback, or photos:
You grant Hridayam a royalty-free, worldwide license to use them in marketing or promotional
material
You agree not to post anything offensive, illegal, or infringing on others’ rights.</p>
            <h1 className='font-[cinzel] font-[500] text-3xl text-black'>8. Privacy </h1>
        <p className='font-[lato] text-[#41444B] w-3/4'>Your use of the site is also governed by our <Link to='/privacy policy'><b>Privacy policy</b></Link>. Please review it to
        understand how we collect and use your data.</p>
            <h1 className='font-[cinzel] font-[500] text-3xl text-black'>9. Limitation of Liability </h1>
        <p className='font-[lato] text-[#41444B] w-3/4'>Hridayam is not liable for:
Indirect, incidental, or consequential damages from use of our website or products
Delays, errors, or losses outside our control.</p>
            <h1 className='font-[cinzel] font-[500] text-3xl text-black'>10. Governing Law </h1>
        <p className='font-[lato] text-[#41444B] w-3/4'>These terms are governed by the laws of India, and any disputes will be
        handled in the courts of India.</p>
            <h1 className='font-[cinzel] font-[500] text-3xl text-black'>11. Changes to These Terms </h1>
        <p className='font-[lato] text-[#41444B] w-3/4'>We may update these Terms & Conditions at any time. Changes take effect once posted on this
        page. Continued use of our website means you accept the new terms.</p>
        </div>
    )
}

export default Termsofservice;
