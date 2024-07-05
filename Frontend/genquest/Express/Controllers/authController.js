// authController.js
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
class AuthController {
  async signup(req, res) {
    try {
      const { name, email, password } = req.body;
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const existingUser = await userModel.getUserByEmail(email);
      if (existingUser) {
        console.log(`Email '${email}' is already registered.`);
        return res.status(409).json({ message: 'Email is already registered' });
      }
  
      const userId = await userModel.createUser(name, email, hashedPassword);
  
      console.log(`User with ID ${userId} created successfully.`);
      res.status(201).json({ message: 'User created successfully' });
      
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  

  async login(req, res) {
    try {
      const { email, password } = req.body;
  
      const user = await userModel.getUserByEmail(email);

      if (!user) {
        console.log(`Login failed. User with email '${email}' not found.`);
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        console.log(`Login failed. Incorrect password for user with email '${email}'.`);
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const userRole = await userModel.getUserRole(email);
      const id=userRole;
      req.session.isLoggedIn = true;
      req.session.userEmail = user.email;
      console.log(`User with email '${email}' logged in successfully.`);
      res.status(200).json({ message: 'Login successful', name: user.name ,email,id});

      console.log('Response Headers:', res.getHeaders());
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  

  logout(req, res) {
    req.session.destroy();
    console.log("Logged Out")
    res.status(200).json({ message: 'Logout successful' });
  }


  async resetPassword(req, res) {
    try {
        const { email, oldPassword, newPassword } = req.body;

   
        const user = await userModel.getUserByEmail(email);
        if (!user) {
            console.log(`User with email '${email}' not found.`);
            return res.status(404).json({ message: 'User not found' });
        }

    
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {

            return res.status(401).json({ message: 'Old password does not match' });
        }

     
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    
        await userModel.updateUserPassword(email, hashedNewPassword);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

}

module.exports = new AuthController();
