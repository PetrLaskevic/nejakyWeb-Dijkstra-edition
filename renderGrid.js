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
		//the MinQueue (Priority Queue) will be set in renderMaze as well, when the size upper bound is going to be known 
		//(as it uses a static array, only allocates memory once)
	}
	hideMaze(){
		this.graphicalMaze.style.display = "none"; // this.graphicalMaze.hidden = true;
		// this.resultParagraph.hidden = true;
	}
	renderMaze(text){

        //TODO: pridat nastaveni grid.maxLength 
        //(na to ale nestaci max delka strany (protoze to pocita vzdalenosti od zacatku, a cesta teoreticky muze delat oka (smycky) )) 
        //Idealne by to chtelo spustit Dijkstru a pak rict, kolik cifer to bude
        //nebo muzu tam dat heuristiku ze max delka strany + jedna cifra (vetsinou staci)
        //=> CELE SE TO RESI PROTOZE TO ZATIM (pred grid verzi) NESLO MENIT dynamicky
        //=> zkusit jestli by slo u gridu (ze bych tam pripadne pridaval cifry podle potreby)

        //odebrani prazdneho radku na konci
	    if(text[text.length - 1].trim() == ""){
	    	text.pop();
	    }

        this.maze = text.slice(1).map(row => row.split('')); //for debugging dbgMazeText console.table(this.dbgMazeText)
		this.dbgMazeText = this.maze;
		console.log(text);

		let grid = document.createElement("responsive-grid");
        [grid.rows, grid.columns] = text[0].split(' ').map(Number);
        [this.pocetRows,this.pocetColumns] = [grid.rows, grid.columns];
        grid.cellStyles = "./visualisation.css";
        document.querySelector("main").appendChild(grid);

		// this.resultParagraph = document.createElement("p");
		// this.resultParagraph.className = "presentResult";
		//appending it to main causes overflow => append it to body
		//adding it here programatically causes duplication when running more mazes
		//so either hide it progrmatically or just add it to markup now
		//(and = together with the body positioning, just accept, that it going to get weird when running more instances of the maze on one page)
		// document.querySelector("body").appendChild(this.resultParagraph);
		this.resultParagraph = document.querySelector(".presentResult");
		this.resultParagraph.textContent = "";

        this.graphicalMaze = grid;

		this.fronta = new priorityQueue(this.pocetRows*this.pocetColumns);
	   
        grid.renderMaze(text);

		this.distances[this.startCoordinates] = 0;
	    console.log("this.endCoordinates", this.endCoordinates);
	    console.log("this.startCoordinates", this.startCoordinates);

		Object.keys(this.distances).forEach(coordinates => {
			const [x,y] = coordinates.split(',').map(Number);
			this.graphicalMaze.setTextToCell([x,y], '∞');
		});
		this.graphicalMaze.setTextToCell(this.startCoordinates, '0');


	  }
	async startDijkstra(){ //async so I can use wait function
		this.graphicalMaze.addClassToCell(this.startCoordinates, "start");
		this.graphicalMaze.addClassToCell(this.endCoordinates, "end");
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
		let lastBeforeWall = this.computeEndField(x,y,direction); //really is the first value out of the bounds of the map in that direction => should be named border
		while(String([x,y]) != String(lastBeforeWall)){
			if(this.maze[x][y] == '#' || this.maze[x][y] == 'C'){
				break;
			}
			//tohle nejak nefunguje
			// this.setTextToCell([x,y], this.n);
			// this.n -= 1;
			//this looks nice
			this.graphicalMaze.addClassToCell([x,y], "cesta");
			this.graphicalMaze.addClassToCell([x,y], direction);
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
		return lastBeforeWall; //is this returned value used?
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
	
	//Pak uz jde tu vizalizaci vylepsovat, ze se bude ukazovat neco z prubehu
	//pr considered policka apod
	//pak tam jde treba doplnovat ty vzdalenosti (cislicka) primo do mapy
	//aby slo videt, jak se updatujou
	// pr. add a table of this.distances as it changes
	async blikPolePoCeste(x,y,direction, edgeWeight){
		let border = this.computeEndField(x,y,direction);
		let lastValueInBounds = [x,y];
		const maxTimePerEdge = 2000;
		//TODO: add nejake takove zrychleni na dlouhych nodes
		const timePerNode = Math.min(maxTimePerEdge / edgeWeight, 225); //250
		while(String([x,y]) != String(border)){
			if(this.maze[x][y] == '#' ){
				break;
			}
			lastValueInBounds = [x,y]; //border returns a field out of map, similarly to a stop condition with < in for loop
			
			this.graphicalMaze.addClassToCell([x,y], "selectedOnWalkThrough");
			await wait(timePerNode); //await wait(250);
			this.graphicalMaze.removeClassFromCell([x,y], "selectedOnWalkThrough");

			//move this check here, so selectedOnWalkThrough gets applied to the 'C' node as well
			if(this.maze[x][y] == 'C'){
				break;
			}

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
		return lastValueInBounds	;
	}
	syncWait(n){
		for(let x = 0; x < n; x++){
			for(let x = 0; x < n; x++){
				for(let x = 0; x < n; x++){
					for(let x = 0; x < n; x++){
						// console.log(x);
						x;
					}
				}
			}
		}
	}
	async walkThroughCesta(cesta, delkyHranList){
		let [x,y] = this.startCoordinates;
		//longer delay for first letter
		this.resultParagraph.querySelector("#c0").classList.add("selectedLetter");
		await wait(1000);
		this.resultParagraph.querySelector("#c0").classList.remove("selectedLetter");

		for( const [index, move] of cesta.entries()){
			//TODO: opravit, ze takhle kdyz zvolime jiny maze, dokud bezi vizualizace tohoto, tak muze byt zlute zvoleno vic pismenek
			this.resultParagraph.querySelector(`#c${index}`).classList.add("selectedLetter");
			[x,y] = await this.blikPolePoCeste(x,y,move, delkyHranList[index]);
			this.resultParagraph.querySelector(`#c${index}`).classList.remove("selectedLetter");
			//with async wait (no matter, how big or small, the yellow flashes on the corner (selectedOnWalkThrough gets removed and put back))
			// await wait(2	);
			//with sync wait, it does not flicker (it stays on on the cornern the whole time)
				this.syncWait(10	);
				this.syncWait(10	);
				this.syncWait(10	);
		}
	}
	getLen(x1,y1,x2,y2){
		//all positive integers, only y xor x changes
		//basically same as numDots in graphGen.js
		return Math.abs(x1+y1 -x2-y2) + 1;
	}
	vypisCestu(x,y){
		let pole = [x,y];
		let sled = [];
		let x1,y1;
		let counterOdKonce = 0;
		let delkyHranList = [];
		this.n = this.delkaCesty;
		while(String(pole) != String(this.startCoordinates)){
			[x1,y1] = this.zJakehoPoleJsmeSemPrisli[pole];
			delkyHranList.push(this.getLen(x1, y1, pole[0], pole[1]));
			let smer = this.urciSmer(x1, y1, pole[0], pole[1]);
			this.obarviPolePoCeste(x1, y1, smer);
			pole = [x1,y1];
			this.graphicalMaze.addClassToCell([x1,y1], "prev");
			// this.setTextToCell([x1, y1], counterOdKonce);
			counterOdKonce += 1;
			if(smer != 'NO'){
				sled.push(smer);
			}else{
				console.log("skip, propojka");
			}
		}
		let cesta = [];
		let index = sled.length - 1;
		while(index > -1){
			cesta.push(sled[index]);
			index -= 1;
		}
		delkyHranList.reverse();
		// ${this.delkaCesty} == pocet policek na ceste 
		// ${cesta.length} == pocet ruznych hran na trase
		let cestaHTMLString = cesta.map((val, i) => `<span id=c${i}>${val}</span>`); //changed id from 1 to c1 because ids which start with 1 are not very valid in CSS, lol: //https://stackoverflow.com/questions/20306204/using-queryselector-with-ids-that-are-numbers
		this.resultParagraph.innerHTML = `<span class='pathText'>Path</span> from <span class='startText'>start</span> to <span class='endText'>end</span> is <span class='pathSequence'>${cestaHTMLString.join('')}</span>`;
		this.walkThroughCesta(cesta, delkyHranList);
		return [cesta, delkyHranList]; //takto se v JS returnuji 2 arrays, tento return pro console.log
	}
	setEdge([fromX, fromY], [toX,toY], className){
		if(fromX == toX && fromY != toY){
			for(let y = Math.min(fromY, toY); y <= Math.max(fromY, toY); y++){
				this.graphicalMaze.addClassToCell([fromX, y], className);
			}
		}else if(fromY == toY && fromX != toX){
			for(let x = Math.min(fromX, toX); x <= Math.max(fromX, toX); x++){
				this.graphicalMaze.addClassToCell([x, fromY], className);
			}
		}else{
			//mozna to bude delat neco funky u "hrany" z 'C'
			//bude, protoze tam je toX a toY undefined
			if((String([fromX, fromY]) == String(this.endCoordinates) && toX == undefined) ||
				(String([toX, toY]) == String(this.endCoordinates) && fromY == undefined)
			){
				return;
			}
			throw Error(`Zero length edge in graph from ${fromX}, ${fromY} to ${toX}, ${toY}`);
		}
	}

	unsetEdge([fromX, fromY], [toX,toY], className){
		if(fromX == toX && fromY != toY){
			for(let y = Math.min(fromY, toY); y <= Math.max(fromY, toY); y++){
				this.graphicalMaze.removeClassFromCell([fromX, y], className);
			}
		}else if(fromY == toY && fromX != toX){
			for(let x = Math.min(fromX, toX); x <= Math.max(fromX, toX); x++){
				this.graphicalMaze.removeClassFromCell([x, fromY], className);
			}
		}else{
			//mozna to bude delat neco funky u "hrany" z 'C'
			//mozna to bude delat neco funky u "hrany" z 'C'
			//bude, protoze tam je toX a toY undefined
			if((String([fromX, fromY]) == String(this.endCoordinates) && toX == undefined) ||
				(String([toX, toY]) == String(this.endCoordinates) && fromY == undefined)
			){
				return;
			}
			throw Error(`Zero length edge in graph from ${fromX}, ${fromY} to ${toX}, ${toY}`);
		}
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

			//stop search if solution has been found
			//(maybe add a fun fact button to scan the rest)
			if(String([fromX, fromY]) == String(this.endCoordinates)){
				console.log(this.distances[this.endCoordinates]);
				this.delkaCesty = this.distances[this.endCoordinates]; //delka cesty v polickach
				this.graphicalMaze.style.setProperty("--distancesColor", "transparent");
				console.log(this.distances);
				console.log(this.vypisCestu(...this.endCoordinates));
				return;
			}

			let volnaOkolniPole = this.graf[[fromX, fromY]]; //neighbors list
			//update distance, if newly discovered is smaller
			for(const [[x,y], weight] of volnaOkolniPole){
				//needed this check here?
				//abychom nenavrhovali jit tam, kde uz jsme byli, odkud jsme vysli
				//myslim si, ze vysledek to neovlivni (kdyz ten check tady nebude), ale usetri to zbytecne opakovani hlavni smycky (kdy by se mnoho krat pridavala a odebirala pole, ktera uz jsme dokoncili)
				if(exploredNodes.has(String([x,y]))){ //String needed, otherwise set compares by reference
					continue;
				}
				
				//setEdgeExplored
				this.graphicalMaze.addClassToCell([fromX, fromY], "from");
				// this.setEdge([fromX, fromY], [x,y], "visited");
				this.setEdge([fromX, fromY], [x,y], "explored");
				await wait(parseInt(animationDelay.value));
				
				

				//this.distances build up is essentially dynamic programming
				if(this.distances[[fromX, fromY]] + weight < this.distances[[x,y]]){
					//the lengths of edges include the nodes they're between, so these nodes get counted two times each (except the start and end node)
					//these differences on each two adjacent edges accumulate, so the final result is inflated
					// => count each of them precisely once
					this.distances[[x,y]] = this.distances[[fromX, fromY]] + weight - 1;
					this.graphicalMaze.setTextToCell([x,y], this.distances[[x,y]]);
					this.zJakehoPoleJsmeSemPrisli[[x,y]] = [fromX, fromY];

					await wait(parseInt(animationDelay.value));
					this.fronta.push([[x,y], this.distances[[x,y]]]);
				}

				this.unsetEdge([fromX, fromY], [x,y], "explored");
				this.graphicalMaze.removeClassFromCell([fromX, fromY], "from");

			}
		}
		console.log(this.distances[this.endCoordinates]);
		this.delkaCesty = this.distances[this.endCoordinates]; //delka cesty v polickach
		console.log(this.distances);
		this.graphicalMaze.style.setProperty("--distancesColor", "transparent");
		console.log(this.vypisCestu(...this.endCoordinates));
	}
}

export {DijkstraMazeApp};