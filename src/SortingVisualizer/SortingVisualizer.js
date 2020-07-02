import './SortingVisualizer.css';
import React from 'react';
import { bubbleSort,
    insertionSort,
    getMergeSortAnimations,
    getQuickSortAnimations,
    getHeapSortAnimations } from '../SortingAlgorithms/SortingAlgorithms';


const barColor = '#00bcd4';//#00bcd4


// const BARCOUNT = 100;

export default class SortingVisualizer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            array:[],
            ANIMATION_SPEED:5,
            running:false,
            BARCOUNT:200,
        };
        this.handleChangeSpeed = this.handleChangeSpeed.bind(this);
        this.handleChangeBarCount = this.handleChangeBarCount.bind(this);
    }

    componentDidMount(){
        this.resetArray()
    }

    refreshPage(){
        window.location.reload();
        this.resetArray();
    }

    resetArray(){
        const array=[];
        this.setState({running:false});
        for (let i=0;i<this.state.BARCOUNT;i++){
            array.push(randomIntFromInterval(5,500));
        }
        this.setState({array});
        //reset colors
        const arrayBars = document.getElementsByClassName('array-bar');
        if (arrayBars){
            
            for (let bar of arrayBars){
                bar.style.backgroundColor=barColor;
            }
        }
        
    }

    doNothing(){

    }

    testSort(sortingFunction){
        
        for (let i=0;i<500;i++){
            let arr=[];
            let length = randomIntFromInterval(0,500);
            for (let j=0;j<length;j++){
                arr.push(randomIntFromInterval(-1000,1000));
            }
            const jsSortedArray = arr.slice().sort((a,b)=>{return (a-b)});
            const sortedArray  = sortingFunction(arr);
            
            
            console.log(areEqual(jsSortedArray,sortedArray));
        }
    }
    
    swap(arr,idx1,idx2){
        const temp = arr[idx1];
        arr[idx1]=arr[idx2];
        arr[idx2]=temp;
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    bubbleSort(){
       
        this.setState({running:true});
        
        const copyArray = this.state.array.slice();
        const arrayBars = document.getElementsByClassName('array-bar');
        const animations = bubbleSort(this.state.array.slice());
        var j=copyArray.length-1;
        
        for (let i=0;i<animations.length;i++){
            let action = animations[i];
            const [idx1,idx2] = action.comparison;
            let barOne = arrayBars[idx1].style;
            let barTwo = arrayBars[idx2].style;
            //make comparison change color
            setTimeout(()=>{
                barOne.backgroundColor = 'red';
                barTwo.backgroundColor = 'red';
                
            },i*this.state.ANIMATION_SPEED)
            //make swap
            setTimeout(()=>{
                if (action.swap){
                    this.swap(copyArray,idx1,idx2);
                    barOne.height = barTwo.height;
                    barTwo.height = copyArray[idx2]+'px';
                }

                if (idx2===j){
                    barOne.backgroundColor = barColor;
                    barTwo.backgroundColor = 'green';
                    j--;
                }
                else{
                barOne.backgroundColor = barColor;
                barTwo.backgroundColor = barColor;
                }
            
            },i*this.state.ANIMATION_SPEED+5)
        }
        setTimeout(()=>{
            //to change whole sorted color
            for (let k=0;k<arrayBars.length;k++){
                setTimeout(()=>{
                    arrayBars[k].style.backgroundColor="rgb("+randomIntFromInterval(0,255)+
                    ","+randomIntFromInterval(0,255)+","+randomIntFromInterval(0,255)+")";
                    if(k===arrayBars.length-1){
                        this.setState({running:false});
                    }
                },k*5)
                
            }
        },animations.length*this.state.ANIMATION_SPEED+10);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    insertionSort(){
        this.setState({running:true});
        const arrayBars = document.getElementsByClassName('array-bar');
        const copyArray = this.state.array.slice(); 
        const copyArray2 = this.state.array.slice();
        const animations = insertionSort(copyArray2);
        const factor = 30;//to adjust timeout
        let sortCompleted=false; //time to change whole sorted array color

        for (let i=0;i<animations.length;i++){
            
            const {focus, comparison} = animations[i];
            for (let j=0;j<comparison.length;j++){
                
                let idx1 = comparison[j][0];
                let idx2 = comparison[j][1];
                let swapped = comparison[j][2];
                let barOne = arrayBars[idx1].style;
                let barTwo = arrayBars[idx2].style;
                //change color to red
                setTimeout(()=>{
                    
                    barOne.backgroundColor="red";
                    barTwo.backgroundColor="red";
                },i*factor+(j*factor)*this.state.ANIMATION_SPEED);
                //make swap if needed
                setTimeout(()=>{
                    if (swapped){
                        this.swap(copyArray, idx1,idx2);
                        barOne.height = copyArray[idx1]+"px";
                        barTwo.height = copyArray[idx2]+"px";
                    }
                },i*factor+(j*factor)*this.state.ANIMATION_SPEED+5);
                //setcolor again to blue
                setTimeout(()=>{
                    barOne.backgroundColor=barColor;
                    barTwo.backgroundColor=barColor;

                },i*factor+(j*factor)*this.state.ANIMATION_SPEED+3);//(i+j)*this.state.ANIMATION_SPEED+8

            }
        }

        let colorChange=setInterval(()=>{
            //keep probing until array is sorted
            
            if (JSON.stringify(copyArray2)===JSON.stringify(copyArray)){
                clearInterval(colorChange);    
                for (let k=0;k<arrayBars.length;k++){
                    setTimeout(()=>{
                        arrayBars[k].style.backgroundColor="rgb("+randomIntFromInterval(0,255)+
                    ","+randomIntFromInterval(0,255)+","+randomIntFromInterval(0,255)+")";
                        if(k===arrayBars.length-1){
                            this.setState({running:false});
                        }
                    },k*5)   
                }
            }
        },500)

        
        
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    heapSort(){
        this.setState({running:true});
        const arrayBars = document.getElementsByClassName('array-bar');
        const animations=getHeapSortAnimations(this.state.array.slice());
        const auxArray = this.state.array.slice();
        const factor = 1.5;
        for (let i=0;i<animations.length;i++){
            const [action,idx1,idx2] = animations[i];
            console.log(animations[i]);
            const barOneStyle = arrayBars[idx1].style;
            const barTwoStyle = arrayBars[idx2].style;
            switch (action){
                case "swap":
                    setTimeout(()=>{
                        this.swap(auxArray,idx1,idx2);
                        barOneStyle.height = auxArray[idx1]+"px";
                        barTwoStyle.height = auxArray[idx2]+"px";
                        barOneStyle.background = "red";
                        barTwoStyle.background = "red";
                    },i*this.state.ANIMATION_SPEED*factor);
                    break;
                case "revert":
                    setTimeout(()=>{
                        barOneStyle.background = barColor;
                        barTwoStyle.background = barColor;
                    },i*this.state.ANIMATION_SPEED*factor);
                    break;
                case "heapSortSwap":
                    setTimeout(()=>{
                    this.swap(auxArray,idx1,idx2);
                        barOneStyle.height = auxArray[idx1]+"px";
                        barTwoStyle.height = auxArray[idx2]+"px";
                        barOneStyle.background = "red";
                        barTwoStyle.background = "red";
                    },i*this.state.ANIMATION_SPEED*factor);
                    break;
                case "initiate":
                    setTimeout(()=>{
                        barOneStyle.background = "yellow";
                        barTwoStyle.background = "yellow";
                    },i*this.state.ANIMATION_SPEED*factor);
                    break;
                case "sorted":
                    setTimeout(()=>{
                        barOneStyle.background = "green";
                        barTwoStyle.background = "green";
                    },i*this.state.ANIMATION_SPEED*factor);
                    break;
                default:
                    console.log(action+"not found");
            }
        }

        setTimeout(()=>{
            //to change whole sorted color
            
            for (let k=0;k<arrayBars.length;k++){
                setTimeout(()=>{
                    
                    arrayBars[k].style.backgroundColor="rgb("+randomIntFromInterval(0,255)+
                    ","+randomIntFromInterval(0,255)+","+randomIntFromInterval(0,255)+")";
                    
                    // arrayBars[k].style.backgroundColor="#3ca59d";
                    if(k===arrayBars.length-1){
                        this.setState({running:false});
                    }
                },k*5)
                
            }
        },animations.length*this.state.ANIMATION_SPEED*factor);



    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    mergeSort(){
        this.setState({running:true});
        // this.running = true;
        const arrayBars = document.getElementsByClassName('array-bar');
        // const arr = Array.from(arrayBars);
        const animations=getMergeSortAnimations(this.state.array.slice());
        //animations array==>[compare,compare,swap.......]
        for (let i=0; i<animations.length;i++){
            const isColorChange = i%3 !==2;
            
            if (isColorChange){
                const [idx1,idx2] = animations[i];
                const barOneStyle = arrayBars[idx1].style;
                const barTwoStyle = arrayBars[idx2].style;
                const color = (i%3===0)?"red":barColor;
                setTimeout(()=>{
                    barOneStyle.backgroundColor = color;
                    barTwoStyle.backgroundColor = color;
                },i*this.state.ANIMATION_SPEED);
            }else{
                //[idx,height]
                setTimeout(()=>{
                    const [idx, newHeight] = animations[i];
                    const barOneStyle = arrayBars[idx].style;
                    barOneStyle.height = newHeight+"px";
                },i*this.state.ANIMATION_SPEED);
            }
        }

        setTimeout(()=>{
            //to change whole sorted color
            
            for (let k=0;k<arrayBars.length;k++){
                setTimeout(()=>{
                    
                    arrayBars[k].style.backgroundColor="rgb("+randomIntFromInterval(0,255)+
                    ","+randomIntFromInterval(0,255)+","+randomIntFromInterval(0,255)+")";
                    
                    // arrayBars[k].style.backgroundColor="#3ca59d";
                    if(k===arrayBars.length-1){
                        this.setState({running:false});
                    }
                },k*5)
                
            }
        },animations.length*this.state.ANIMATION_SPEED);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    quickSort(){
        this.setState({running:true});
        const arrayBars = document.getElementsByClassName('array-bar');
        const auxArray = this.state.array.slice();
        const animations = getQuickSortAnimations(this.state.array.slice());
        const factor = 1;
        for (let i=0;i<animations.length;i++){
            
            if (animations[i].length===2){
                const [string, idx] = animations[i];
                if (idx<this.state.BARCOUNT){
                    switch (string){
                        case "doPivot":
                            setTimeout(()=>{
                                arrayBars[idx].style.backgroundColor="yellow";
                            },i*this.state.ANIMATION_SPEED*factor);
                            break;
                        case "undoPivot":
                            setTimeout(()=>{
                                arrayBars[idx].style.backgroundColor=barColor;
                            },i*this.state.ANIMATION_SPEED*factor);
                            break;
                        case "colorStoreIdx":
                            setTimeout(()=>{
                                arrayBars[idx].style.backgroundColor="#45046a";
                            },i*this.state.ANIMATION_SPEED*factor);
                            break;
                        case "revertColorStoreIdx":
                            setTimeout(()=>{
                                arrayBars[idx].style.backgroundColor=barColor;
                            },i*this.state.ANIMATION_SPEED*factor);
                            break;
                        default:
                            console.log("case not found!!");
                            break;
                    }
                }

                
                
            }
            else{
                const [string,idx1,idx2] = animations[i];
                const barOneStyle = arrayBars[idx1].style;
                const barTwoStyle = arrayBars[idx2].style;

                switch (string){
                    case "swap":
                        setTimeout(()=>{
                            this.swap(auxArray, idx1,idx2);
                            barOneStyle.backgroundColor = "#111d5e";
                            barTwoStyle.backgroundColor = "#111d5e";
                           
                            barOneStyle.height = auxArray[idx1]+"px";
                            barTwoStyle.height = auxArray[idx2]+"px";
                            
                        },i*this.state.ANIMATION_SPEED*factor);
                        break;
                    case "revert":
                        setTimeout(()=>{
                            
                            barOneStyle.backgroundColor = barColor;
                            barTwoStyle.backgroundColor = barColor;

                        },i*this.state.ANIMATION_SPEED*factor);
                        break;
                    default:
                        console.log("case not found!!");
                        break;
                    
                }
            }
        }
        setTimeout(()=>{
            //to change whole sorted color
            for (let k=0;k<arrayBars.length;k++){
                setTimeout(()=>{
                    arrayBars[k].style.backgroundColor="rgb("+randomIntFromInterval(0,255)+
                    ","+randomIntFromInterval(0,255)+","+randomIntFromInterval(0,255)+")";
                    if(k===arrayBars.length-1){
                        this.setState({running:false});
                    }
                },k*5)
                
            }
        },animations.length*this.state.ANIMATION_SPEED*factor);
            
    }

    //////////////////////////////////////////SLIDERS AND FUNCTIONS///////////////////////////////////
    
    handleChangeSpeed(event){
        this.setState({ANIMATION_SPEED:10-event.target.value});
        // this.resetArray();
      };

    handleChangeBarCount(event){
        this.setState({BARCOUNT:event.target.value});
        this.resetArray();
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    render(){
        const running = this.state.running;
        const array = this.state.array;
        return (
            <div className="all-container">
                <div className="btn-container">
                    <div className="slider-container">
                        <span style={{color:"white"}}>Sorting Speed</span>
                        <input step="0.1" value={10-this.state.ANIMATION_SPEED} disabled={running} onChange={this.handleChangeSpeed} type="range" min="1" max="9"/>
                    </div>
                    <div className="slider-container">
                        <span style={{color:"white"}}>Number of Bars</span>
                        <input step="1" value={this.state.BARCOUNT} disabled={running} onChange={this.handleChangeBarCount} type="range" min="100" max="400"/>
                    </div>
                    <button disabled={running} className="btn btn-light" onClick={()=>{this.resetArray()}}>
                        Generate New Array
                    </button>
                    <button disabled={running} className="btn btn-light" onClick={()=>{this.bubbleSort()}}>
                        Bubble Sort
                    </button>
                    <button disabled={running} className="btn btn-light" onClick={()=>{this.quickSort()}}>
                        Quick Sort
                    </button>
                    <button disabled={running} className="btn btn-light" onClick={()=>{this.mergeSort()}}>
                        Merge Sort
                    </button>
                    <button disabled={running} className="btn btn-light" onClick={()=>{this.heapSort()}}>
                        Heap Sort
                    </button>
                    <button disabled={running} className="btn btn-light" onClick={()=>{this.insertionSort()}}>
                        Insertion Sort
                    </button>
                 
                </div> 
           
                <div className="array-container">
                    {array.map((value, idx)=>{
                        return (<div className="array-bar" key={idx}
                        style={{height:`${value}px`,
                        width:`${Math.floor((500-this.state.BARCOUNT)/100)}px`,
                        background:`${barColor}`}}>
                            
                        </div>)
                    })}
                        
                </div>
            </div>      
            
        )
    }
}

function randomIntFromInterval(min,max){
    //including min and max
    return Math.floor(Math.random()*(max-min+1)+min)
}

function areEqual(arr1,arr2){
    if (arr1.length!==arr2.length){return false}
    
    if (JSON.stringify(arr1)!==JSON.stringify(arr2)){return false}
    return true;
}