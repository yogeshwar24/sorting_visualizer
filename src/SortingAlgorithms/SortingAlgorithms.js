function swap(arr,idx1,idx2){
    const temp = arr[idx1];
    arr[idx1]=arr[idx2];
    arr[idx2]=temp;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
//animations array of objects = [{comparison:[a,b],swap:[a,b]}]
export function bubbleSort(array){
    let animations=[];
    
    var sorted;
    for (var i=0;i<array.length;i++){
        sorted=false;
        for (var j=0; j<array.length-i-1;j++){
            animations.push({comparison:[j,j+1]});
            if (array[j]>array[j+1]){
                animations[animations.length-1].swap=true;
                swap(array, j, j+1);
                sorted=true;
            }
            
        }
      
        if (!sorted){
            return animations;
        }
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// animations = [{focus:a, comparison:[[a,b,swap(a boolean)],....]}]
export function insertionSort(array){
    let animations=[];
    for (let i=1;i<array.length;i++){
        let obj = {focus:i, comparison:[]}
        
        for (let j=i;j>=1;j--){
            let swapped = true;
            obj.comparison.push([j-1,j]);
            if (array[j-1]>array[j]){
                obj.comparison[obj.comparison.length-1].push(swapped);
                swap(array,j-1,j);
            }else{
                obj.comparison[obj.comparison.length-1].push(!swapped);
                break;
            }
        }
        animations.push(obj);
    }
    
    return animations;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

export function getMergeSortAnimations(array){
    const auxArray = array.slice();
    const animations = [];

    if (array.length<=1){
        return array;
    }
    let start = 0;
    let end = array.length-1;
    mergeSortHelper(array,auxArray,animations,start,end);

    return animations;

}

function mergeSortHelper(mainArray,auxArray,animations,start,end){
    const mid = Math.floor((start+end)/2);
    if (start===end){return;}
    //replace the positions of mainArray and auxArray
    //so that in last call of mergeSortHelper, the true mainArray gets filled correctly
    mergeSortHelper(auxArray,mainArray,animations,start,mid);
    mergeSortHelper(auxArray,mainArray,animations,mid+1,end);

    merge(mainArray,auxArray,animations,start,mid,end);

}

function merge(mainArray,auxArray,animations,start,mid,end){
    let k = start; //traverse main array
    let i = start; //for auxArray
    let j = mid+1;

    while (i<=mid && j<=end){
        animations.push([i,j]);
        animations.push([i,j]);
        if (auxArray[i]<=auxArray[j]){
            animations.push([k,auxArray[i]]);
            mainArray[k++] = auxArray[i++];

        }else{
            animations.push([k,auxArray[j]]);
            mainArray[k++] = auxArray[j++];
        }
    }
    //take care of remaining values
    while (i<=mid){
        animations.push([i,i]);
        animations.push([i,i]);
        animations.push([k,auxArray[i]]);
        mainArray[k++] = auxArray[i++];
    }
    while (j<=end){
        animations.push([j,j]);
        animations.push([j,j]);
        animations.push([k,auxArray[j]]);
        mainArray[k++] = auxArray[j++];
    }

}
////////////////////////////////////////////////////////////////////////////////////////////////////

export function getQuickSortAnimations(array){
    const animations=[];
    quickSortHelper(array,0,array.length-1,animations);
    return animations;
}

function quickSortHelper(array,start,end,animations){

    if (start>=end){return ;}

    const pivot = partition(array,start,end,animations);
    quickSortHelper(array,start,pivot-1,animations);
    quickSortHelper(array,pivot+1,end,animations);

}

function partition(array,start,end,animations){
    
    // const mid=Math.floor((start+end)/2) ;
    const randomIdx = Math.floor(Math.random()*(end-start)+start);
    swap(array,start,randomIdx);
    animations.push(["swap",randomIdx,start]);
    animations.push(["revert",randomIdx,start]);
    const pivot = start; 
    animations.push(["doPivot",pivot]);
    let storeIndex = start+1;

    
    for (let i=start+1;i<=end;i++){
        animations.push(["colorStoreIdx",storeIndex]);
        if (array[i]<array[pivot]){
            animations.push(["swap",storeIndex,i]);
            animations.push(["revert",storeIndex,i]);
            swap(array,storeIndex,i);
            storeIndex++;
        }
        animations.push(["revertColorStoreIdx",storeIndex]);
        
    }
    animations.push(["swap",storeIndex-1,pivot]);
    animations.push(["revert",storeIndex-1,pivot]);
    swap(array,pivot,storeIndex-1);
    animations.push(["undoPivot",pivot]);
    return storeIndex-1;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
export function getHeapSortAnimations(arr){
    const animations = [];
    heapSort(arr,animations);
    return animations;
}

function heapSort(arr,animations){
    buildMaxHeap(arr,animations);
    for (let i=(arr.length)-1;i>=0;i--){
        animations.push(["heapSortSwap",0,i]);//change color to blue
        animations.push(["revert",0,i]);//revert
        swap(arr,0,i);
        maxHeapify(arr,0,0,i-1,animations);
        animations.push(["sorted",i,i]);
    }
}

function buildMaxHeap(arr,animations){
    for (let i=Math.floor(arr.length/2)-1;i>=0;i--){
        maxHeapify(arr,i,0,arr.length-1,animations);
    }
}

function maxHeapify(arr,idx,start,end,animations){
    if (start<=end){
        animations.push(["initiate",start,end]);//change color to yellow
        let leftChild = 2*idx+1
        let rightChild = leftChild+1;
        if (rightChild>end && leftChild>end){
            return;
        }
        if (rightChild>end){
            rightChild = leftChild;
        }

        if (arr[idx]<Math.max(arr[leftChild],arr[rightChild])){
            if (Math.max(arr[leftChild],arr[rightChild])===arr[leftChild]){
                animations.push(["swap",idx,leftChild]);//change color to red
                animations.push(["revert",idx,leftChild]);//revert color
                swap(arr,idx,leftChild);
                maxHeapify(arr,leftChild,start,end,animations);
            }else{
                animations.push(["swap",idx,rightChild]);//change color to red
                animations.push(["revert",idx,rightChild]);//revert color
                swap(arr,idx,rightChild);
                maxHeapify(arr,rightChild,start,end,animations);
            }
        }
        animations.push(["revert",start,end]);//revert color 
    }
}



















