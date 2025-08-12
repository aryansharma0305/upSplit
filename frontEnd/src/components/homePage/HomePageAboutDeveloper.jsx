import React from "react";
import { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutDeveloper = () => {
  useEffect(() => {
    AOS.init({ once: false, duration: 800 });
  }, []);
  return (
    <section className="bg-gray-50 pt-16 pb-40" id="about-developer">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600  to-teal-600 bg-clip-text text-transparent" data-aos="fade-down">About the Developer</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto text-sm md:text-base mb-10" data-aos="flip-down">
          Hi, I'm Aryan Sharma — a passionate web developer and student at IIIT Bangalore. I love creating sleek, functional, and user-friendly applications that solve real-world problems.
        </p>
        <div className="flex flex-col items-center gap-4">
          <img
            src="/images/developerPhoto.jpeg" 
            alt="Developer"
            className="w-32 h-32 rounded-full object-cover shadow-md"
            data-aos="zoom-in"
          />
          <p className="text-lg font-semibold bg-gradient-to-r from-emerald-600  to-teal-600 bg-clip-text text-transparent">Aryan Sharma</p>
          <div className="flex gap-4 text-muted-foreground" data-aos="flip-right">
            <a href="https://github.com/aryansharma0305" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/aryansharma0305" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="mailto:aryansharma0305@gmail.com">Email</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutDeveloper;
