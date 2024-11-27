export class GuiManagerCl {
  static tBodyEl = document.getElementById("tBody");

  static clearTbodyEl() {
    this.tBodyEl.innerHTML = "";
  }

  constructor(item) {
    this.item = item; // Array to hold the user objects

    this.tRowEl = document.createElement("tr");
    this.tBtnEl = document.createElement("button"); /////
    this.tdRowEl = document.createElement("td");

    // Click evetns
    //   this.tBtnEl.addEventListener("click", this.onClickBtn.bind(this));
    //  this.tdRowEl.addEventListener("click", this.onClickDRow.bind(this));
  }

  addToTable() {
    // --- Add  to Table
    this.tRowEl.appendChild(this.tdRowEl);
    this.tRowEl.appendChild(this.tBtnEl); /////////////

    GUIManagerCl.tBodyEl.appendChild(this.tRowEl);
  }

  onClickBtn() {}
  onClickDRow() {}

  changeColor(user) {
    // this.iLeftEl.style.cssFloat = "left"
    // if (user.status == 'X') { // Green
    //     // -- Change color of row --
    //     this.tdRowEl.style.backgroundColor = '#c7e5c9' //Lightgreen
    //     this.tdRowEl.style.borderColor = '#224823' //Darkgreen
    //     // -- change icon of row
    //     this.iLeftEl.className = "fa fa-check"
    //     this.iLeftEl.style.fontSize = "30px"
    //     this.iLeftEl.style.color = '#224823'
    // }
    // else { // Red
    //     // -- Change color of row --
    //     this.tdRowEl.style.backgroundColor = 'lightred'
    //     this.tdRowEl.style.borderColor = '#73000c' //Darkgreen
    //     // -- change icon of row
    //     this.iLeftEl.className = "fa fa-times"
    //     this.iLeftEl.style.fontSize = "30px"
    //     this.iLeftEl.style.color = '#73000c'
    // }
  }

  // ---------------------------------------------------------------------------------------------
  //      PAI
  // ---------------------------------------------------------------------------------------------

  // --- on Searching ----------------------------------------------------------------------------
  search(user) {
    var lo_Row = this;

    RowCl.searchEl.addEventListener("keyup", function () {
      // console.log(user)
      lo_Row.filter();
    });
  }

  // --- Filter users based on the search --------------------------------------------------------

  ///////// we can use filter as in following example from ES6 in Sololearn
  // let res = [4, 5, 1, 8, 2, 0].filter(function (x) {
  //   return x > 3;
  // });

  //////////
  filter() {
    var filter, txtValue;
    filter = RowCl.searchEl.value.toUpperCase();

    txtValue = this.tdRowEl.textContent || this.tdRowEl.innerText;

    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      this.tRowEl.style.display = "";
    } else {
      this.tRowEl.style.display = "none";
    }
  }
}
