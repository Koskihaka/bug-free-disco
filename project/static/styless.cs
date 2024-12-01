body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}

.container {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

h1 {
    text-align: center;
    color: #333;
}

label {
    font-weight: bold;
    color: #555;
    display: block;
    margin-bottom: 0.5rem;
}

input,
select {
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 1rem;
}

button {
    width: 100%;
    background-color: #007bff;
    color: white;
    padding: 0.8rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

.error {
    color: red;
    font-size: 0.9rem;
}

.success {
    color: green;
    font-size: 0.9rem;
}

/* Responsive design for mobile screens */
@media (max-width: 600px) {
    .container {
        padding: 1.5rem;
        width: 100%;
    }
}
