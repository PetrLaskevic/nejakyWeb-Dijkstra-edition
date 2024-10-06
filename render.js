//A binary min-heap implementation using heapify Javascript library (https://github.com/luciopaiva/heapify/tree/main), modified to allow pair of integers (for coordinates) to be stored
// this is just to make it clear that we are using a 1-based array; changing it to zero won't work without code changes
const ROOT_INDEX = 1;
class MinQueue {
    constructor(capacity = 64, keys = [], keys2 = [], priorities = [], KeysBackingArrayType = Uint32Array, PrioritiesBackingArrayType = Uint32Array) {
        this._capacity = capacity;
        this._keys = new KeysBackingArrayType(capacity + ROOT_INDEX);
        this._keys2 = new KeysBackingArrayType(capacity + ROOT_INDEX);
        this._priorities = new PrioritiesBackingArrayType(capacity + ROOT_INDEX);
        // to keep track of whether the first element is a deleted one
        this._hasPoppedElement = false;
        if (keys.length !== priorities.length) {
            throw new Error("Number of keys does not match number of priorities provided.");
        }
        if (capacity < keys.length) {
            throw new Error("Capacity less than number of provided keys.");
        }
        // copy data from user
        for (let i = 0; i < keys.length; i++) {
            this._keys[i + ROOT_INDEX] = keys[i];
            this._keys2[i + ROOT_INDEX] = keys2[i];
            this._priorities[i + ROOT_INDEX] = priorities[i];
        }
        this.length = keys.length;
        for (let i = keys.length >>> 1; i >= ROOT_INDEX; i--) {
            this.bubbleDown(i);
        }
    }
    get capacity() {
        return this._capacity;
    }
    clear() {
        this.length = 0;
        this._hasPoppedElement = false;
    }
    /**
     * Bubble an item up until its heap property is satisfied.
     */
    bubbleUp(index) {
        const row = this._keys[index];
        const column = this._keys2[index];
        const priority = this._priorities[index];
        while (index > ROOT_INDEX) {
            // get its parent item
            const parentIndex = index >>> 1;
            if (this._priorities[parentIndex] <= priority) {
                break; // if parent priority is smaller, heap property is satisfied
            }
            // bubble parent down so the item can go up
            this._keys[index] = this._keys[parentIndex];
            this._keys2[index] = this._keys2[parentIndex];
            this._priorities[index] = this._priorities[parentIndex];
            // repeat for the next level
            index = parentIndex;
        }
        // we finally found the place where the initial item should be; write it there
        this._keys[index] = row;
        this._keys2[index] = column;
        this._priorities[index] = priority;
    }
    /**
     * Bubble an item down until its heap property is satisfied.
     */
    bubbleDown(index) {
        const row = this._keys[index];
        const column = this._keys2[index];
        const priority = this._priorities[index];
        const halfLength = ROOT_INDEX + (this.length >>> 1); // no need to check the last level
        const lastIndex = this.length + ROOT_INDEX;
        while (index < halfLength) {
            const left = index << 1;
            // pick the left child
            let childPriority = this._priorities[left];
            let childKeyRow = this._keys[left];
            let childKeyColumn = this._keys2[left];
            let childIndex = left;
            // if there's a right child, choose the child with the smallest priority
            const right = left + 1;
            if (right < lastIndex) {
                const rightPriority = this._priorities[right];
                if (rightPriority < childPriority) {
                    childPriority = rightPriority;
                    childKeyRow = this._keys[right];
                    childKeyColumn = this._keys2[right];
                    childIndex = right;
                }
            }
            if (childPriority >= priority) {
                break; // if children have higher priority, heap property is satisfied
            }
            // bubble the child up to where the parent is
            this._keys[index] = childKeyRow;
            this._keys2[index] = childKeyColumn;
            this._priorities[index] = childPriority;
            // repeat for the next level
            index = childIndex;
        }
        // we finally found the place where the initial item should be; write it there
        this._keys[index] = row;
        this._keys2[index] = column;
        this._priorities[index] = priority;
    }
    /**
     * @param key the identifier of the object to be pushed into the heap
     * @param priority the priority associated with the key
     */
    push(row, column, priority) {
        if (this.length === this._capacity) {
            throw new Error("Heap has reached capacity, can't push new items");
        }
        if (this._hasPoppedElement) {
            // replace root element (which was deleted from the last pop)
            this._keys[ROOT_INDEX] = row;
            this._keys2[ROOT_INDEX] = column;
            this._priorities[ROOT_INDEX] = priority;
            this.length++;
            this.bubbleDown(ROOT_INDEX);
            this._hasPoppedElement = false;
        }
        else {
            const pos = this.length + ROOT_INDEX;
            this._keys[pos] = row;
            this._keys2[pos] = column;
            this._priorities[pos] = priority;
            this.length++;
            this.bubbleUp(pos);
        }
    }
    /**
     * @return the key with the highest priority, or undefined if the heap is empty
     */
    pop() {
        if (this.length === 0) {
            return undefined;
        }
        this.removePoppedElement();
        this.length--;
        this._hasPoppedElement = true;
        return [this._keys[ROOT_INDEX], this._keys2[ROOT_INDEX]];
    }
    peekPriority() {
        this.removePoppedElement();
        return this._priorities[ROOT_INDEX];
    }
    peek() {
        this.removePoppedElement();
        return [this._keys[ROOT_INDEX], this._keys2[ROOT_INDEX]];
    }
    removePoppedElement() {
        if (this._hasPoppedElement) {
            // since root element was already deleted from pop, replace with last and bubble down
            this._keys[ROOT_INDEX] = this._keys[this.length + ROOT_INDEX];
            this._keys2[ROOT_INDEX] = this._keys2[this.length + ROOT_INDEX];
            this._priorities[ROOT_INDEX] = this._priorities[this.length + ROOT_INDEX];
            this.bubbleDown(ROOT_INDEX);
            this._hasPoppedElement = false;
        }
    }
    get size() {
        return this.length;
    }
    dumpRawPriorities() {
        this.removePoppedElement();
        const result = Array(this.length - ROOT_INDEX);
        for (let i = 0; i < this.length; i++) {
            result[i] = this._priorities[i + ROOT_INDEX];
        }
        return `[${result.join(" ")}]`;
    }
}



class priorityQueue {
  constructor(size) {
    //the queue will receive distances of cells
    //the lower the distance to end the better
    //so for that reason, the lower the distance = priority, the better
    //items with lowest distance will be picked first
    this.heap = new MinQueue(size);
  }
  push(element){ //enqueue
    let coordinates, priority, column, row;
    [coordinates, priority] = element;
    [row, column] = coordinates;

    console.warn(coordinates)
    console.warn("priority", priority);
    
    this.heap.push(row, column, priority);
  }
  pop(){ //dequeue
  	let row, column;
  	[row, column] = this.heap.pop();
    return [row, column];
  }
  get length(){
  	return this.heap.length;
  }
  get empty(){
	return this.length == 0;
  }
}




class Stack{
	constructor() {
	  this.elements = [];
	}
	put(element) { //enqueue
	  this.elements.push(element);
	}
	get() { //dequeue
	  return this.elements.pop();
	}
	get length() {
		return this.elements.length;
	}
	get empty() { //isEmpty
	  return this.elements.length === 0;
	}
}

//https://stackoverflow.com/a/53452241/11844784
function wait(ms) {
	if(ms > 0){
		return new Promise((resolve, reject) => {
	    setTimeout(() => {
	      resolve(ms)
	    }, ms )
	  })
	}else{
		return;
	}
}

let animationDelay = document.getElementById("visualisationDelayPicker");

class DijkstraMazeApp{
	constructor(graf) {
		this.distances = {};
		this.graf = graf.graf;
		this.pocetColumns = 0;
		this.pocetRows = 0;
		this.maze = [];
		this.startCoordinates = graf.startCoordinates;
		this.endCoordinates = graf.endCoordinates;
		this.zcelaHotovo = false;
		this.poleVidena = {};
		this.zJakehoPoleJsmeSemPrisli = {};
		this.delkaCesty = 0;

		//setting all to infinity, the source node will be set in renderMaze
		Object.keys(graf.graf).forEach(key => {
			this.distances[key] = Infinity;
		});
		//TLDR: added
		//The end node is not in the graph, since no edges go from it...
		// => maybe I should change it and add "2,2": [] as a node in a graph (to make other code more elegant)
		// this.distances[this.endCoordinates] = Infinity;
		//the MinQueue (Priority Queue) will be set in renderMaze as well, when the size upper bound is going to be known 
		//(as it uses a static array, only allocates memory once)
	}
	hideMaze(){
		this.graphicalMaze.hidden = true;
		document.getElementById("funFact").classList.add("hiddenWithNoHeight");
	}
	createMaze(){
		let table = document.createElement("table");
		let tbody = document.createElement("tbody");
		table.appendChild(tbody);
		document.getElementById("tableContainer").appendChild(table);
		this.graphicalMaze = tbody;
	}
	handleTabletChange(e) {
		// Check if the media query is true
		//solved with  this.handleTabletChange.bind(this) //which gave the function the necessary value of this as a reference of the class (and thus the possibility to call this. handleTabletChange, and give it this.graphicalMaze) and instead of the MediaQueryList value (which is passed as the e parameter)
		//previously: THE VALUE OF this WHEN CALLED FROM this.handleTabletChange(mediaQuery); => IS THE CLASS BFSMazeApp, AS EXPECTED
		//HOWEVER, THE VALUE OF this WHEN CALLED FROM mediaQuery.addListener(this.handleTabletChange); IS MediaQueryList!!!!!!
		//MediaQueryList { media: "(max-width: 954px)", matches: false, onchange: null }
		// matches: false
		// media: "(max-width: 954px)"
		let tableElement = this.graphicalMaze.parentElement;
		if (e.matches) {
		// Then log the following message to the console
		console.log('Media Query Matched!');
		tableElement.className = "useFullWidthForMobile"; //same as document.getElementById("tableParent")

		}else{
			console.log("media query not matched");
			tableElement.className = "";
		}
	}

	tryToFitTheMazeOnScreen(){

		const tdMinWidthInclPadding = 12; //10 + 1px padding
		const tableBorderSpacing = 1.5;
		let calculateMinWidth = tdMinWidthInclPadding * this.pocetColumns;
		calculateMinWidth += 30;
		calculateMinWidth += (this.pocetColumns - 1) * tableBorderSpacing;
		const mediaQuery = window.matchMedia('(max-width:'+ calculateMinWidth +'px)');
		
		// Register event listener

		//for the callback event listener, i.e. handleTabletChange will be the value of *this* MediaQueryList and not BFSMAzeApp
		//therefore it is not possible to write: mediaQuery.addListener(this.handleTabletChange); //(will raise TypeError)
		//mediaQuery.addListener(function(){alert(this)}) //the value of this is a MediaQueryList, so  this.handleTabletChange cannot be called from here with the tableElement parameter 
		//mediaQuery.addListener(function(){this.handleTabletChange(tableElement)}) //exactly: Uncaught TypeError: this.handleTabletChange is not a function
		//=> so doint it like this:
		mediaQuery.addListener(this.handleTabletChange.bind(this)); //nice, src bind fix https://stackoverflow.com/questions/36794934/pass-argument-to-matchmedia-addlistener-callback-function

		// Initial check
		this.handleTabletChange(mediaQuery);
	}
	renderMaze(text){
		this.createMaze();
		//odebrani prazdneho radku na konci
	    if(text[text.length - 1].trim() == ""){
	    	text.pop();
	    }
		console.log(text);

	    [this.pocetRows,this.pocetColumns] = text[0].split(' ').map(Number);

		this.fronta = new priorityQueue(this.pocetRows*this.pocetColumns);
	   
	    this.tryToFitTheMazeOnScreen();
	    let mapText = document.getElementById("mapText");
	    mapText.textContent = "";

		//First row is maze size info (this.pocetRows,this.pocetColumns), so skipping it
		//actual maze starts on second row
	    for(let x = 1; x < text.length; x++){

	    	let row = text[x].split("")
	    	console.log(row)
	    	const tr = this.graphicalMaze.insertRow();
	    	
	    	//the 2D array, storing the maze in place
			this.maze.push(row); 
	    	mapText.textContent += row + "\n";

	    	for(let y = 0; y < text[1].length; y++){
				let character = row[y];
				const td = tr.insertCell();
				const div = document.createElement("div");
				div.className = "s";
				td.appendChild(div);
	  			if(character == "#"){
	  				td.classList.add("green");
	  			}else if(character == "S"){
					this.startCoordinates = [x-1,y];
				}else if(character == "C"){
					this.endCoordinates = [x-1, y];
				}
	    	}
		}
		this.distances[this.startCoordinates] = 0;
	    console.log("this.endCoordinates", this.endCoordinates);
	    console.log("this.startCoordinates", this.startCoordinates);
	  }
	  presentResult(){
	  	let row = this.graphicalMaze.insertRow()
	  	let holder = row.insertCell();
	  	holder.colSpan = 77; //this.pocetColumns
	  	holder.className = "presentResult";
	  	holder.innerHTML = "<span class='pathText'>Path</span> length from <span class='startText'>start</span> to end is " + this.delkaCesty + " cells long";

	  	document.getElementById("funFact").classList.remove("hiddenWithNoHeight");
	  }
	  async startDijkstra(){ //async so I can use wait function
			this.addClassToCell(this.startCoordinates, "start");
			this.addClassToCell(this.endCoordinates, "end");
			this.runDijkstra();
		}
		computeEndField(x,y,direction){
			if(direction == 'D'){
				return [this.pocetRows, y];
			}else if(direction == 'N'){
				return [-1, y];
			}else if(direction == 'P'){
				return [x, this.pocetColumns];
			}else if(direction == 'L'){
				return [x,-1];
			}
		}
		obarviPolePoCeste(x,y,direction){
			let lastBeforeWall = this.computeEndField(x,y,direction);
			while(String([x,y]) != String(lastBeforeWall)){
				if(this.maze[x][y] == '#' || this.maze[x][y] == 'C'){
					break;
				}
				this.addClassToCell([x,y], "cesta");
				this.addClassToCell([x,y], direction);
				// this.addClassToCell([x,y], `cesta ${direction}`);
				if (direction == 'D'){
					x += 1;
				} else if (direction == 'N'){
					x -= 1;
				} else if (direction == 'P'){
					y += 1;
				} else if (direction == 'L'){
					y -= 1;
				}
			}
		}
		urciSmer(fromX, fromY, x, y){
			if(x > fromX){
				return 'D'; //down
			}else if(x < fromX){
				return 'N'; //up
			}else if(y > fromY){
				return 'P'; //right
			}else if(y < fromY){
				return 'L'; //left
			}
			throw new Error(`Invalid parameters ${fromX}, ${fromY}, ${x}, ${y}`);
		}
		vypisCestu(x,y){
			let pole = [x,y];
			let sled = [];
			let x1,y1;
			while(String(pole) != String(this.startCoordinates)){
				[x1,y1] = this.zJakehoPoleJsmeSemPrisli[pole];
				let smer = this.urciSmer(x1, y1, pole[0], pole[1]);
				// this.obarviPolePoCeste(x1, y1, smer);
				pole = [x1,y1];
				if(smer != 'NO'){
					sled.push(smer);
				}else{
					console.log("skip, propojka");
				}
			}
			let cesta = "";
			let index = sled.length - 1;
			while(index > -1){
				cesta += sled[index];
				index -= 1;
			}
			
			document.getElementById("presentResult").innerHTML = "<span class='pathText'>Path</span> from <span class='startText'>start</span> to end is " + cesta;
			return cesta;
		}
		async jetRovneDokudNeZed(x,y,direction){
			let lastBeforeWall = this.computeEndField(x,y,direction);
			console.log("lastBeforeWall",lastBeforeWall);
			console.log("should be defined",x,y);
			let zacatekLajnyX, zacatekLajnyY;
			[zacatekLajnyX, zacatekLajnyY] = [x,y];
			let previousField;
			let stopLoopImmediatelyFlag = false;
			//=>IN JS, that would compare memory locations, so I use String()
			//performance OK, the arrays have 2 items each
			while(String([x,y]) != String(lastBeforeWall)){
				console.log("hello?!!")
				this.addClassToCell([x,y], "considered");
				await wait(parseInt(animationDelay.value));
				this.removeClassFromCell([x,y], "considered");
				if(this.cellHasClass([x,y], "visited")){
					this.addClassToCell([x,y], "skipped");
				}else{
					this.addClassToCell([x,y], "visited");
				}
				if(this.maze[x][y] == '#'){
					[x,y] = previousField;
					break;
				}else if(this.maze[x][y] == 'C'){
					console.log('yo');
						if(!(String([x,y]) in this.zJakehoPoleJsmeSemPrisli)){
						if(String([x,y]) != String([zacatekLajnyX, zacatekLajnyY])){
							this.zJakehoPoleJsmeSemPrisli[String([x,y])] = [zacatekLajnyX, zacatekLajnyY, direction];
						}
						}
						console.log("nalezen cil")
						console.log(this.vypisCestu(x,y));
						stopLoopImmediatelyFlag = true;
						this.zcelaHotovo = true;
						break;
				}
				previousField = [x,y];
				if (direction == 'D'){
					x += 1;
				} else if (direction == 'N'){
					x -= 1;
				} else if (direction == 'P'){
					y += 1;
				} else if (direction == 'L'){
					y -= 1;
				}
			}
			return previousField;
			//takhle nema zadny efekt:
			// if(stopLoopImmediatelyFlag){
			// 	console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
			// 	return;
			// }
			
		}
		async runDijkstra(){
			// let x,y, direction;
			let exploredNodes = new Set();
			this.fronta.push([this.startCoordinates, 0]);
			while(this.fronta.empty == false && this.zcelaHotovo == false){

				let [fromX,fromY] = this.fronta.pop();
				if(exploredNodes.has(String([fromX,fromY]))){ //String needed, otherwise set compares by reference
					continue;
				}
				exploredNodes.add(String([fromX,fromY]));

				let volnaOkolniPole = this.graf[[fromX, fromY]]; //neighbors list
				//update distance, if newly discovered is smaller
				for(const [[x,y], weight] of volnaOkolniPole){
					//needed this check here?
					//LOL: V TOM TUTORIALU JE TO BLBE 
					//NIKOLI, BLBOST JSEM PROVEDL JA => NEMEL JSEM TAM DAT exploredNodes.add(String([x,y])); ZA TEN CHECK
					//=> kdyz tady je ten check, A TEN ASSIGNMENT ZA TIM =  exploredNodes.add(String([x,y]));
					//tak si oznacime jako videna vsechna pole, na ktera bychom se sli v dalsi iteraci podivat !!
					
					//abychom nenavrhovali jit tam, kde uz jsme byli, odkud jsme vysli
					//myslim si, ze vysledek to neovlivni (kdyz ten check tady nebude), ale usetri to zbytecne opakovani hlavni smycky (kdy by se mnoho krat pridavala a odebirala pole, ktera uz jsme dokoncili)
					if(exploredNodes.has(String([x,y]))){ //String needed, otherwise set compares by reference
						continue;
					}
					// exploredNodes.add(String([x,y]));
					//this.distances build up is essentially dynamic programming
					if(this.distances[[fromX, fromY]] + weight < this.distances[[x,y]]){
						this.distances[[x,y]] = this.distances[[fromX, fromY]] + weight;
						this.zJakehoPoleJsmeSemPrisli[[x,y]] = [fromX, fromY];
						this.fronta.push([[x,y], this.distances[[x,y]]]);
					}
				}
			}
			console.log(this.distances[this.endCoordinates]);
			console.log(this.distances);
			this.vypisCestu(...this.endCoordinates);
		}
		addClassToCell(coordinates, className){
			//coordinates are row : column
			//tables (tbody) support only rows : column (cells is the method of td only, not tbody) 
			let row, column;
			[row, column] = coordinates;
			try{
				this.graphicalMaze.rows[row].cells[column].classList.add(className);
			}catch(TypeError){
				console.warn("TypeError caught", "row", row, "column", column);
			}
		}
		removeClassFromCell(coordinates, className){
			let row, column;
			[row, column] = coordinates;
			try{
				this.graphicalMaze.rows[row].cells[column].classList.remove(className);
			}catch(TypeError){
				console.warn("TypeError caught", "row", row, "column", column);
			}
		}
		cellHasClass(coordinates, className){
			let row, column;
			[row, column] = coordinates;
			try{
				return this.graphicalMaze.rows[row].cells[column].classList.contains(className);
			}catch(TypeError){
				console.warn("TypeError caught", "row", row, "column", column);
			}
		}

}

export {DijkstraMazeApp};