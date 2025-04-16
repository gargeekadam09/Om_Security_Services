import React from 'react';

const services = [
  {
    title: "Residential Security Guard Services",
    description: "This service provides trained security personnel for gated communities, apartments, and villas.",
    features: [
      "Choose guard timings (day/night or 24/7)",
      "Customizable contract duration",
      "Background-verified professionals",
      "Real-time guard check-in/out updates (optional)"
    ],
    useCase: "Ideal for families or housing societies looking to improve their on-premise security.",
  },
  {
    title: "Event Security Management",
    description: "Security for events such as weddings, corporate functions, or concerts.",
    features: [
      "Book based on event size and location",
      "On-demand team of bouncers or trained guards",
      "Access control setup (ID checks, scanning, etc.)",
      "Option for plain-clothed or uniformed guards"
    ],
    useCase: "Perfect for event planners or individuals hosting large gatherings.",
  },
  {
    title: "Commercial Security Solutions",
    description: "Businesses can hire security guards for offices, factories, or retail stores.",
    features: [
      "Scheduled or round-the-clock guards",
      "CCTV monitoring integration (optional)",
      "Incident reporting and visitor logs",
      "Emergency response trained staff"
    ],
    useCase: "Essential for business owners to protect assets, employees, and infrastructure.",
  },
  {
    title: "Personal Bodyguard Services",
    description: "Users can book trained personal security officers for individual protection.",
    features: [
      "Choose between armed or unarmed bodyguards",
      "Booking available per hour/day/week",
      "Trained in close protection and threat handling",
      "Discreet or high-visibility presence"
    ],
    useCase: "Ideal for VIPs, businesspersons, or anyone requiring secure travel or escort.",
  }
];

const Services = () => {
  return (
    <div className="services-section" style={{ backgroundColor: '#e57373', padding: '2rem', borderRadius: '12px', color: 'black' }}>
      <h2 style={{
        color: 'black',
        fontSize: '2.5rem',
        marginBottom: '2rem',
        textAlign: 'center',
        textDecoration: 'underline'
      }}>
        Available Services
      </h2>

      {services.map((service, index) => (
        <div key={index} style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.75rem', color: 'black' }}>
            {index + 1}. {service.title}
          </h3>
          <p>{service.description}</p>
          <strong>Features:</strong>
          <ul>
            {service.features.map((feat, idx) => (
              <li key={idx}>{feat}</li>
            ))}
          </ul>
          <p><strong>Use Case:</strong> {service.useCase}</p>
        </div>
      ))}
    </div>
  );
};

export default Services;
