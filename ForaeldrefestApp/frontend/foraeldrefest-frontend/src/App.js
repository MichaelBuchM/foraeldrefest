import React, { useState } from 'react';
import './App.css';
import GuestList from './GuestList';
import stringify from 'json-stringify-safe';

import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

function App() {
  const [name, setName] = useState('');
  const [isHostForCourse1, setIsHostForCourse1] = useState(false);
  const [isHostForCourse2, setIsHostForCourse2] = useState(false);
  const [isCouple, setIsCouple] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [address, setAddress] = useState('');
  const [guests, setGuests] = useState([]);
  const [groupAssignments, setGroupAssignments] = useState(null);

  const handleAddGuest = (e) => {
    e.preventDefault();
    const newGuest = {
      name: name,
      isHostForCourse1: isHostForCourse1,
      isHostForCourse2: isHostForCourse2,
      address: address,
    };
  
    let guestsToAdd = [newGuest];
  
    if (partnerName !== '') {
      const couple = {
        name: partnerName,
        isHostForCourse1: isHostForCourse1,
        isHostForCourse2: isHostForCourse2,
        address: address,
      };
      newGuest.isCoupleWith = couple;
      couple.isCoupleWith = newGuest;
      guestsToAdd.push(couple);
    }
  
    setGuests((prevState) => {
      return [...prevState, ...guestsToAdd];
    });
  
    setName('');
    setIsHostForCourse1(false);
    setIsHostForCourse2(false);
    setIsCouple(false);
    setPartnerName('');
    setAddress('');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddGuest(e);
    setName('');
    setIsHostForCourse1(false);
    setIsHostForCourse2(false);
    setIsCouple(false);
    setPartnerName('');
    setAddress('');
  };
  
  const submitGuests = async () => {
    // Submit the guest list to the backend and get the group assignments
    // Replace 'http://localhost:3001/guests' with the URL of your NestJS backend
    const response = await fetch('http://localhost:3001/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: stringify({ guests }),
    });
    const data = await response.json();
    setGroupAssignments(data);
  };

  const handleDeleteGuest = (index) => {
    const updatedGuests = guests.filter((_, i) => i !== index);
    setGuests(updatedGuests);
  };


  return (
    <div className="App">
      <div>
        <header>
          <h1>Forældrefest</h1>
        </header>
      </div>
      <div className="left-side">
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
            <div>
              <TextField
                label="Deltager Navn"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isHostForCourse1}
                    onChange={(e) => setIsHostForCourse1(e.target.checked)}
                    color="primary"
                  />
                }
                label="Vært for forret?"
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isHostForCourse2}
                    onChange={(e) => setIsHostForCourse2(e.target.checked)}
                    color="primary"
                  />
                }
                label="Vært for hovedret?"
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCouple}
                    onChange={(e) => setIsCouple(e.target.checked)}
                    color="primary"
                  />
                }
                label="Har partner?"
              />
            </div>
            {isCouple && (
              <div>
                <TextField
                  label="Partners Navn"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                />
              </div>
            )}
          {(isHostForCourse1 || isHostForCourse2) && (
              <div>
                <TextField
                  label="Adresse"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            )}
            <div>
              <Button type="submit" variant="contained" color="primary">
                Tilføj deltager
              </Button>
            </div>      
          </form>
        </CardContent>
      </Card>    
      <div>
        <Button type="submitGuests" variant="contained" color="primary" onClick={submitGuests}>
          Beregn grupper
        </Button>
      </div>
{/* Display area for showing the assigned groups */}
{groupAssignments && (
  <div>
  <h2>Grupper</h2>
  <div>
  <h3>Forret:</h3>
    <table>
      <thead>
        <tr>
          <th>Addresse</th>
          <th>Vært</th>
          <th>Gæster</th>
        </tr>
      </thead>
      <tbody>
        {groupAssignments.course1Groups.map((group, index) => (
          <React.Fragment key={`group2-${index}`}>
            <tr>
              <td>{group.address}</td>
              <td>{group.members.find((person) => person.isHostForCourse1)?.name || ''}</td>
              <td></td>
            </tr>
            {group.members.filter((person) => !person.isHostForCourse1).map((member, index) => (
              <tr key={`member2-${index}`}>
                <td></td>
                <td></td>
                <td>{member.name}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
  <div>
  <h3>Hovedret:</h3>
    <table>
      <thead>
        <tr>
          <th>Addresse</th>
          <th>Vært</th>
          <th>Gæster</th>
        </tr>
      </thead>
      <tbody>
        {groupAssignments.course2Groups.map((group, index) => (
          <React.Fragment key={`group2-${index}`}>
            <tr>
              <td>{group.address}</td>
              <td>{group.members.find((person) => person.isHostForCourse2)?.name || ''}</td>
              <td></td>
            </tr>
            {group.members.filter((person) => !person.isHostForCourse2).map((member, index) => (
              <tr key={`member2-${index}`}>
                <td></td>
                <td></td>
                <td>{member.name}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
  <div>
    <h3>Number of people in the same group for both courses:</h3>
    {groupAssignments.repeatCounts}
  </div>
</div>
)}
</div>
  <GuestList guests={guests} onDelete={handleDeleteGuest}/>
</div>
);
}

export default App;

