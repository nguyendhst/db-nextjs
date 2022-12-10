

function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email } = req.body;

    if (
      !name ||
      name.trim() === '' ||
      !email ||
      !email.includes('@')
    ) {
      res.status(422).json({ message: 'Invalid input.' });
      return;
    }

    const newStudent = {
      id: new Date().toISOString(),
      name,
      email
    };

    console.log(newStudent);
    res.status(201).json({ message: 'Created student!', student: newStudent });
  }
}