import 'react';

const About = () => {
  return (
    <div className="card  justify-self-center bg-base-100 w-80 shadow-xl ">
      <div className="card bg-base-100 w-96 shadow-xl">
        <figure className="px-10 pt-10">
          <img
            src="/images/about.jfif"
            alt="About"
            className="rounded-xl"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-center">About Us</h2>
          <p className="text-center text-lg">
            We are a passionate team dedicated to delivering top-notch products and services.
            Our goal is to provide high-quality solutions that meet the needs of our customers.
            Our company was founded with the vision of making a meaningful impact on the world.
          </p>
          <div className="text-center mt-6">
            <button className="btn btn-primary">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
