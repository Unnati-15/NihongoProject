import 'react';

const Contact = () => {
  return (
    <div className="card  justify-self-center bg-base-100 w-80 shadow-xl ">
  <figure className="px-10 pt-10">
    <img
      src="/images/contact.jfif"
      alt="Shoes"
      className="rounded-xl" />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">Shoes!</h2>
    <form>
           
            <div className="mb-4">
              <label className="block text-left text-lg" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="input input-bordered w-full mt-2"
                placeholder="Your email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-left text-lg" htmlFor="message">Message</label>
              <textarea
                id="message"
                className="textarea textarea-bordered w-full mt-2"
                placeholder="Your message"
                required
              ></textarea>
            </div>
          </form>
    <div className="card-actions">
      <button className="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>
  );
};

export default Contact;
