import React,{useEffect,useState} from "react";
import './App.css';

const Clients =()=>{
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [newClient, setNewClient] = useState({
    name: "",
    age: "",
    location: ""
  });
  const pageSize = 5;

  useEffect(() => {
    fetchClients(currentPage);
  }, [currentPage]);

  const fetchClients = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/client?pageNo=${page}&pageSize=${pageSize}`);
      const result = await response.json();
      setClients(result.content || []); 
      setTotalPages(result.totalPages || 0);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages-1) setCurrentPage(currentPage + 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const addClient = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });
      if (response.ok) {
        fetchClients(currentPage); 
        setNewClient({ name: "", age: "", location: "" }); 
      }
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };
  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const startIndex = currentPage * pageSize;

  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <h2>Client List</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        clients.length > 0 ? (
        <table style={{ borderCollapse: 'collapse', width: '50%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr key={client.id}>
                 {/* <td>{startIndex + index + 1}</td> */}
                <td>{client.id}</td>
                <td>{client.name}</td>
                <td>{client.age}</td>
                <td>{client.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
        ):(
            <p>No Clients available.</p>
        )
      )}

      <div className="pagination">

       <br/>
        <button onClick={handlePrevious} disabled={currentPage === 0}>
          Previous
        </button>
        {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              disabled={currentPage === page}
              className={currentPage === page ? "active" : ""}
            >
              {page + 1}
            </button>
          ))}
        <button onClick={handleNext} disabled={currentPage === totalPages-1}>
          Next
        </button>
        <br/>
        <span>Page {currentPage+1} of {totalPages}</span>
      </div>


      <h2>Add New Client</h2>
      <form onSubmit={addClient}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newClient.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={newClient.age}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newClient.location}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Client</button>
      </form>
    </div>
  );
};

export default Clients;
