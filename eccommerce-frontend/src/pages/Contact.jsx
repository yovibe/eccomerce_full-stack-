import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[70vh]">
      <div className="text-center mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-serif tracking-tight text-gray-900 mb-6"
        >
          Let's <span className="italic">connect</span>.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-lg text-gray-500 max-w-xl mx-auto"
        >
          Whether you have a question about an order, styling advice, or our return policy, our dedicated concierge team is here to assist you.
        </motion.p>
      </div>

      <div className="flex flex-col md:flex-row gap-16 justify-center max-w-5xl mx-auto">
        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full md:w-1/3 space-y-12"
        >
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-900 mb-3">Client Services</h3>
            <p className="text-gray-500 mb-1">hello@stylej.com</p>
            <p className="text-gray-500">+1 (800) 123-4567</p>
            <p className="text-gray-400 text-sm mt-3">Mon-Fri: 9am - 8pm EST</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-900 mb-3">Headquarters</h3>
            <p className="text-gray-500 mb-1">125 Fashion Avenue</p>
            <p className="text-gray-500">New York, NY 10001</p>
            <p className="text-gray-500">United States</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-900 mb-3">Press & Partnerships</h3>
            <p className="text-gray-500">press@stylej.com</p>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full md:w-2/3 bg-[#f9f9f9] p-8 md:p-12 rounded-[32px] border border-gray-100"
        >
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Thanks for reaching out! We will be in touch shortly."); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <input type="text" className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Message</label>
              <textarea rows="5" className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition resize-none" required></textarea>
            </div>

            <button type="submit" className="w-full bg-black text-white font-medium py-4 rounded-full hover:bg-gray-800 transition-colors">
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
