import { assets } from '../assets/assets'


const Contact = () => {
    return (
      <div>
        <div className="text-center text-2xl pt-10 border-t">
          
        </div>
        <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28" >
          <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
          <div className="flex flex-col justify-center items-start gap-6">
            <img className="h-40" src={assets.logo} alt="" />
            <p className='font-semibold text-xl text-gray-600'>Nosso Escritório</p>
            <p className='text-gray-500'>2509 Rua Laguna <br /> Suite 350, Porto Velho, RO</p>
            <p className='text-gray-500'>Tel: (xx) x xxx-0132 <br /> Email: admin@sucesso_rep.com</p>
            {/* <p className='font-semibold text-xl text-gray-600'>Carrers at Forever</p>
            <p className='text-gray-500'>Learn more about our teams and job openings.</p>
            <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Mais</button> */}
          </div>
        </div>
      </div>
    )
  }
  
  export default Contact
  