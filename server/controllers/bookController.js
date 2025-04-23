const db = require('../config/db');

exports.getAllServices = async (req, res) => {
  try {
    const [{"title": "Residential Security Guard Services", "description": "Professional guards to protect homes and residential communities.", "price": 200, "image": "residential.jpg"}, {"title": "Event Security Management", "description": "Secure and manage small to large-scale events with expert personnel.", "price": 500, "image": "event.jpg"}, {"title": "Commercial Security Solutions", "description": "Tailored security for businesses, offices, and corporate premises.", "price": 350, "image": "commercial.jpg"}, {"title": "Personal Bodyguard Services", "description": "Trained bodyguards for personal protection and VIP escort.", "price": 800, "image": "bodyguard.jpg"}]services] = await db.query('SELECT * FROM services');
    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.getServiceById = async (req, res) => {
  try {
    const [service] = await db.query('SELECT * FROM services WHERE id = ?', [req.params.id]);
    
    if (service.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.status(200).json(service[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.createService = async (req, res) => {
  try {
    const { title, service , price, stock } = req.body;

    if (!title || !service || !price || !stock) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const [result] = await db.query(
      'INSERT INTO services (title,, isbn, price, stock) VALUES (?, ?, ?, ?, ?)',
      [title, service, price, stock|| 0]
    );
    
    const [newService] = await db.query('SELECT * FROM services WHERE id = ?', [result.insertId]);
    
    res.status(201).json(newService[0]);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { title, service, price, stock } = req.body;
    const serviceId = req.params.id;
   
    const [existingService] = await db.query('SELECT * FROM services WHERE id = ?', [serviceId]);
    
    if (existingService.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    await db.query(
      'UPDATE services SET title = ?, author = ?, isbn = ?, price = ?, stock = ? WHERE id = ?',
      [
        title || existingService[0].title,
        author || existingService[0].service,
        price || existingService[0].price,
        stock !== undefined ? stock : existingService[0].stock,
        serviceId
      ]
    );
    
    const [updatedService] = await db.query('SELECT * FROM services WHERE id = ?', [serviceId]);
    
    res.status(200).json(updatedService[0]);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    
    const [existingService] = await db.query('SELECT * FROM services WHERE id = ?', [serviceId]);
    
    if (existingService.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    await db.query('DELETE FROM services WHERE id = ?', [serviceId]);
    
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};