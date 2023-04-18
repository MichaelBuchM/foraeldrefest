import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

function GuestList({ guests, onDelete }) {
  return (
    <div className="right-side">
      <h2>Deltagerliste</h2>
      <Card>
        <CardContent>
          <ol>
            {guests.map((guest, index) => (
              <li key={index}>
                {guest.name}
                {guest.isCoupleWith && (
                  <span>
                    {' '}
                    (Partner: {guest.isCoupleWith.name})
                  </span>
                )}
                <button onClick={() => onDelete(index)}>Delete</button>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

export default GuestList;
