// Firebase Realtime Database Settings
const databaseURL = "https://memorize-dict-default-rtdb.europe-west1.firebasedatabase.app/";

// DOM Elements
const tableBody = document.getElementById('tBody');
const lemmaFilterInput = document.getElementById('lemmaFilter');
const freqFilterInput = document.getElementById('freqFilter');

// Filter Criteria
let lemmaFilter = '';
let freqFilter = '';

// Event Listeners for Filters
lemmaFilterInput.addEventListener('input', (e) => {
  lemmaFilter = e.target.value.toLowerCase();
  fetchData(); // Re-fetch and apply filters
});

freqFilterInput.addEventListener('change', (e) => {
  freqFilter = e.target.value;
  fetchData(); // Re-fetch and apply filters
});

/* // Function to Fetch Data
async function fetchData() {
  tableBody.innerHTML = ''; // Clear existing rows
  try {
    const response = await fetch(`${databaseURL}.json?orderBy="$key"&limitToFirst=10`);
    const data = await response.json();
    populateTable(data); // Call function to populate rows
  } catch (error) {
    console.error('Error fetching data:', error);
  }
} */

// Function to Fetch Data
async function fetchData() {
  tableBody.innerHTML = ''; // Clear existing rows
  try {
    // Fetch the first 10 rows ordered by key
    const response = await fetch(`${databaseURL}.json?orderBy="$key"&limitToFirst=1000`);
    const data = await response.json();

    // Filter rows by lemma if a filter value is provided
    const filteredData = Object.keys(data)
      .filter((key) => {
        const item = data[key];
        if (lemmaFilter) {
          return item.lemma && item.lemma.toLowerCase().startsWith(lemmaFilter);
        }
        return true; // Include all rows if no filter is applied
      })
      .reduce((result, key) => {
        result[key] = data[key];
        return result;
      }, {});

    populateTable(filteredData); // Populate rows with the filtered data
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}



// Function to Populate Table Rows
/* function populateTable(data) {
  for (const key in data) {
    const item = data[key];

    // Apply Filters
    if (
      lemmaFilter &&
      !(item.lemma && item.lemma.toLowerCase().startsWith(lemmaFilter))
    ) {
      continue;
    }
    if (freqFilter && String(item.freq) !== freqFilter) {
      continue;
    }

    const row = document.createElement('tr');

    // Set row color based on status
    row.style.backgroundColor = item.status === "F" ? "yellow" : "";

    row.innerHTML = `
      <td>${key}</td>
      <td>${item.lemma || ''}</td>
      <td>${item.status || ''}</td>
      <td>${item.freq || ''}</td>
      <td>
        <button onclick="updateRow('${key}', '${item.status}')">
          <i class="fas fa-flag"></i> <!-- Flag icon -->
        </button>
        <button onclick="deleteRow('${key}')">
          <i class="fas fa-trash"></i> <!-- Trash can icon -->
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  }
} */

// Function to Populate Table Rows
function populateTable(data) {
  for (const key in data) {
    const item = data[key];

    // Apply Filters
    if (
      lemmaFilter &&
      !(item.lemma && item.lemma.toLowerCase().startsWith(lemmaFilter))
    ) {
      continue;
    }
    if (freqFilter && String(item.freq) !== freqFilter) {
      continue;
    }

    const row = document.createElement('tr');

    // Add a data-id attribute to identify each row uniquely
    row.setAttribute('data-id', key);

    // Set row color based on status
    row.style.backgroundColor = item.status === "F" ? "yellow" : "";

    row.innerHTML = `
      <td>${key}</td>
      <td>${item.lemma || ''}</td>
      <td class="status-cell">${item.status || ''}</td>
      <td>${item.freq || ''}</td>
      <td>
        <button onclick="updateRow('${key}', '${item.status}')">
          <i class="fas fa-flag"></i> <!-- Flag icon -->
        </button>
        <button onclick="deleteRow('${key}')">
          <i class="fas fa-trash"></i> <!-- Trash can icon -->
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  }
}


// Expose updateRow globally for inline button handling
window.updateRow = function (id, status) {
  updateRow(id, status); // Pass the current status dynamically
};



/* // Function to Update an Existing Record and Toggle Status
async function updateRow(id, currentStatus) {
  try {
    // Capture the current scroll position
    const currentScrollPosition = 10 ; // tableBody.scrollTop;

    // Toggle between "F" and an empty string
    const newStatus = currentStatus === "F" ? "" : "F";

    // Fetch the current record to preserve other fields
    const response = await fetch(`${databaseURL}/${id}.json`);
    const currentRecord = await response.json();

    if (response.ok) {
      // Update the status while preserving other fields
      const updatedRecord = { ...currentRecord, status: newStatus };

      const patchResponse = await fetch(`${databaseURL}/${id}.json`, {
        method: 'PATCH', // Use PATCH instead of PUT for partial update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecord),
      });

      if (patchResponse.ok) {
        alert(`Record updated successfully! Status is now "${newStatus}"`);
        
        // Fetch the updated data and refresh the table
        await fetchData();

        // Restore the scroll position
        tableBody.scrollTop = currentScrollPosition;
      } else {
        console.error('Error updating record:', patchResponse.statusText);
      }
    } else {
      console.error('Error fetching current record:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
 */

// Function to Update an Existing Record and Toggle Status
async function updateRow(id, currentStatus) {
  try {
    // Toggle between "F" and an empty string
    const newStatus = currentStatus === "F" ? "" : "F";

    // Fetch the current record to preserve other fields
    const response = await fetch(`${databaseURL}/${id}.json`);
    const currentRecord = await response.json();

    if (response.ok) {
      // Update the status while preserving other fields
      const updatedRecord = { ...currentRecord, status: newStatus };

      const patchResponse = await fetch(`${databaseURL}/${id}.json`, {
        method: 'PATCH', // Use PATCH instead of PUT for partial update
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecord),
      });

      if (patchResponse.ok) {
        alert(`Record updated successfully! Status is now "${newStatus}"`);

        // Find the row in the table by its ID
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) {
          // Update the status cell in the row
          const statusCell = row.querySelector('.status-cell');
          if (statusCell) {
            statusCell.textContent = newStatus || ' '; // Set to blank if the status is empty
          }

          // Optionally, toggle the row's background color based on the status
          if (newStatus === "F") {
            row.style.backgroundColor = 'yellow';
          } else {
            row.style.backgroundColor = ''; // Reset the background color if status is blank
          }
        }
      } else {
        console.error('Error updating record:', patchResponse.statusText);
      }
    } else {
      console.error('Error fetching current record:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


// Function to Delete a Record
async function deleteRow(id) {
  try {
    const response = await fetch(`${databaseURL}/${id}.json`, {
      method: 'DELETE',
    });
    if (response.ok) {
      alert('Record deleted successfully!');
      fetchData();
    } else {
      console.error('Error deleting record:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Initial Fetch Call
fetchData();
/// --


/// --



  //--------------------------------------------
  
  


      //}
// ---------------------------------------------------------------------------------------------
// Snapshot
// ---------------------------------------------------------------------------------------------
// const app = initializeApp(appSettings)
// const database = getDatabase(app)
// const khatmaPathDB = "/khatma2/432/khatma/"  // later: "/khatamat/432/khatma/"
// const khatmaRef = ref(database, khatmaPathDB)

// const dbRef = ref(getDatabase());
// get(child(dbRef, `/user`)).then((snapshot) => {
//     var ssUsers = snapshot

//     onValue(khatmaRef, function (snapshot) {
//         var ssKhatma = snapshot
//         // Main
//         //main(ssUsers, ssKhatma, database, khatmaPathDB)

//     })

// }).catch((error) => {
//     console.error(error);
// });

// ---------------------------------------------------------------------------------------------
// Tabstrips
// ---------------------------------------------------------------------------------------------
/* var homeTab = document.getElementById("homeTab");
var userTab = document.getElementById("userTab");
var bookTab = document.getElementById("bookTab"); 

const app = initializeApp(appSettings);

//// Beginn

// ---------------------------------------------------------------------------------
// Home 
// ---------------------------------------------------------------------------------
 homeTab.addEventListener("click", function () { 
  DBUserCl.initializeDB(app, "/user/");
  //-----------------------------------------
  onValue(DBUserCl.headRef, function (snapshot) {
    DBUserCl.initializeSSArray(snapshot);
    //-----------------------------------------
    DBKhatmaCl.initializeDB(app, "/khatma/");
    onValue(DBKhatmaCl.headRef, function (snapshot) {
      DBKhatmaCl.initializeSSArray(snapshot);

      let sPath = "/hizb/" + DBKhatmaCl.getCurrentKhatmaNo();

      DBHizbCl.initializeDB(app, sPath);
      onValue(DBHizbCl.headRef, function (snapshot) {
        DBHizbCl.initializeSSArray(snapshot);
        // let aUser = Object.values(userSnapshot.val());
        // let aHizb = Object.values(hizbSnapshot.val());

        GuiHizbCl.clearTbodyEl();

        DBHizbCl.aSnapshot.map((hizb, i) => {
          var oDBHizb = new DBHizbCl(hizb);
          var mCurrentUser = DBUserCl.aSnapshot.find((item) => {
            return item.user_id === hizb.user_id;
          });
          var oDBUser = new DBUserCl(mCurrentUser);
          var oGuiHizb = new GuiHizbCl(hizb, oDBHizb, oDBUser);

          // Call Methods
          oGuiHizb.addToTable(oGuiHizb);
          // oGuiUser.onClickBtn(oDBUser);

          // Row.changeColor(newUser)
          // Row.search(newUser)
        });
      });
    });
  });
 }); 

// ---------------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------------
userTab.addEventListener("click", function () {
  // alert("user");

  DBUserCl.initializeDB(app, "/user/");

  onValue(DBUserCl.headRef, function (snapshot) {
    DBUserCl.initializeSSArray(snapshot);
    GuiUserCl.clearTbodyEl();

    DBUserCl.aSnapshot.map((user) => {
      // Initiate Objects
      var oDBUser = new DBUserCl(user);
      var oGuiUser = new GuiUserCl(user, oDBUser);

      // Call Methods

      oGuiUser.addToTable(oGuiUser);
      // oGuiUser.onClickBtn(oDBUser);

      // Row.changeColor(newUser)
      // Row.search(newUser)
    });
  });
});

// ---------------------------------------------------------------------------------
// Book
// ---------------------------------------------------------------------------------
bookTab.addEventListener("click", function () {
  DBKhatmaCl.initializeDB(app, "/khatma/");
  onValue(DBKhatmaCl.headRef, function (snapshot) {
    DBKhatmaCl.initializeSSArray(snapshot);
    let sPath = "/hizb/"; //+ DBKhatmaCl.getCurrentKhatmaNo();

    DBHizbCl.initializeDB(app, sPath);
    onValue(DBHizbCl.headRef, function (snapshot) {
      DBHizbCl.initializeSSArray(snapshot);

      DBKhatmaCl.addHizbSnapshotArray(DBHizbCl.snapshot, DBHizbCl.aSnapshot);

      GuiKhatmaCl.clearTbodyEl();

      DBKhatmaCl.aSnapshot.map((khatma) => {
        // Initiate Objects
        var oDBKhatma = new DBKhatmaCl(khatma);
        var oGuiKhatma = new GuiKhatmaCl(khatma, oDBKhatma);

        // Call Methods
        oGuiKhatma.addToTable();
        // oGuiUser.onClickBtn(oDBUser);
        // Row.changeColor(newUser)
        // Row.search(newUser)
      });

      GuiKhatmaCl.addKhatmaBtn();
    });
  });
}); */

//// End

// --------------------------------------------------------------------------------------------------------------------------------------{
// get(child(dbRef, `/user`))
//   .then((snapshot) => {
//     var ssUsers = snapshot;

//     onValue(khatmaRef, function (snapshot) {
//       var ssKhatma = snapshot;

//       //   // ---------------------------------------------------------------------------------
//       //   // Home
//       //   // ---------------------------------------------------------------------------------
//       //   homeTab.addEventListener("click", function () {
//       //     alert("home");
//       //     main(ssUsers, ssKhatma, database, khatmaPathDB);
//       //   });

//       //   // ---------------------------------------------------------------------------------
//       //   // User
//       //   // ---------------------------------------------------------------------------------
//       //   userTab.addEventListener("click", function () {
//       //     alert("user");
//       //     user(ssUsers, database);
//       //   });

//       //   // ---------------------------------------------------------------------------------
//       //   // Book
//       //   // ---------------------------------------------------------------------------------
//       //   bookTab.addEventListener("click", function () {
//       //     alert("book");
//       //     book(ssKhatma, database);
//       //   });
//     });
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// // })

// // ---------------------------------------------------------------------------------------------
// // Main
// // ---------------------------------------------------------------------------------------------
// function main(ssUsers, ssKhatma, database, khatmaPathDB) {
//   let aKhatma = Object.values(ssKhatma.val()); // Change JSON format to Array format
//   let aUser = Object.values(ssUsers.val()); // Change JSON format to Array format

//   RowCl.clearUserTbodyEl();
//   UserCl.setDB(database, khatmaPathDB);

//   for (let i = 0; i < aUser.length; i++) {
//     // Join
//     var currentUser = aUser.find((obj) => {
//       return obj.user_id === aKhatma[i].user_id;
//     });
//     //
//     // Initiate Objects
//     var newUser = new UserCl(
//       aKhatma[i].hizb_id,
//       aKhatma[i].user_id,
//       currentUser.name,
//       //result.name, // aUser[aKhatma[i].user_id-1].name, // join user and khatma
//       aKhatma[i].status
//     );

//     var Row = new RowCl(newUser);

//     // Call Methods
//     Row.addToTable(newUser);
//     Row.changeColor(newUser);
//     Row.search(newUser);
//   }
// }

// // ---------------------------------------------------------------------------------------------
// // User
// // ---------------------------------------------------------------------------------------------
// function user(ssUsers, database) {
//   const userPathDB = "/user/"; // later: "/khatamat/432/khatma/"
//   const userRef = ref(database, userPathDB);

//   GuiUserCl.setDB(database, userPathDB);
//   let aUser = Object.values(ssUsers.val()); // Change JSON format to Array format

//   for (let i = 0; i < aUser.length; i++) {
//     // Initiate Objects
//     var oUser1 = new GuiUserCl(aUser[i]);
//     var oGuiItem = new GUIManagerCl(aUser[i]);

//     // Call Methods
//     oUser1.addToTable(oUser1);
//     // Row.changeColor(newUser)
//     // Row.search(newUser)
//   }
// }

// // ---------------------------------------------------------------------------------------------
// // Book
// // ---------------------------------------------------------------------------------------------
// function book(ssKhatma, database) {
//   const khatmaPathDB = "/khatma2/"; // later: "/khatamat/432/khatma/"
//   const khatmaRef = ref(database, khatmaPathDB);

//   GuiKhatmaCl.setDB(database, khatmaPathDB);
//   let aKhatma = Object.values(ssKhatma.val()); // Change JSON format to Array format

//   for (let i = 0; i < aKhatma.length; i++) {
//     // Initiate Objects
//     console.log(aKhatma[i]);
//     var oKhatma = new GuiKhatmaCl(aKhatma[i]);
//     var oGuiItem = new GUIManagerCl(aKhatma[i]);

//     // Call Methods
//     oKhatma.addToTable(oKhatma);
//     // Row.changeColor(newUser)
//     // Row.search(newUser)
//   }
// }

//-------------------------------------------------------------------------------------
