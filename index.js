fetch("http://localhost:8080/candidate/read-all")
    .then(response => {
        return response.json()
    })
    .then(candidates => {
        candidatesCache.setAll(candidates)
        updateCandidatesTable()
    })

function candidateToTableRow(candidate){
    return `<tr>
        <td class="name-${candidate.id}">${candidate.name}</td>
        <td class="party-${candidate.id}">${candidate.party}</td>
        <td class="votes-${candidate.id}">${candidate.votes}</td>
        <td><button onclick="setFormToEdit(${candidate.id})">Rediger</button></td>
        <td><button onclick="deleteCandidate(${candidate.id})">Slet</button></td>
    </tr>`
}

function updateCandidatesTable(){
    console.log("Opdaterer Kandidater...")
    let candidateTableRows = ""
    if(candidatesCache.getAll().length>0) {
        candidatesCache.getAll().forEach(c => candidateTableRows += candidateToTableRow(c))
        document.getElementById("candidate-table-body").innerHTML = candidateTableRows
    }
}

function saveCandidate(){
    let candidate={
        id: Number(document.getElementById("candidate-id").innerText),
        name: document.getElementById("name").value,
        party: document.getElementById("party").value,
        votes: Number(document.getElementById("votes").value)
    }
    console.log("Read Candidate From Form: "+candidate.name)
    saveInBackend(candidate,(candidate.id==0)?"create":"update")
}

function saveInBackend(candidate,action){
    fetch("http://localhost:8080/candidate/"+action,{
        method: (candidate.id==0)?"POST":"PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(candidate)
    })
        .then(response => {
            if(!response.ok)
                throw "Failed to "+action+" candidate"
            return response.json()
        })
        .then(newCandidate => {
            switch(action){
                case "create": candidatesCache.add(newCandidate); console.log("Created candidate: "+newCandidate); break
                case "update": candidatesCache.edit(newCandidate); console.log("Updated candidate: "+newCandidate)
            }
            updateCandidatesTable()
        })
}

function setFormToCreate(){
    document.getElementById("form-title").innerText="Tilføj Kandidat"
    document.getElementById("candidate-id").innerText=0
    document.getElementById("form-button").onclick=saveCandidate
    document.getElementById("form-button").innerText="Tilføj"
}

function setFormToEdit(id){
    document.getElementById("form-title").innerText="Rediger Kandidat"
    document.getElementById("candidate-id").innerText=id
    let candidate=candidatesCache.findById(id)
    document.getElementById("name").value=candidate.name
    document.getElementById("party").value=candidate.party
    document.getElementById("votes").value=candidate.votes
    document.getElementById("form-button").innerText="Opdater"
    document.getElementById("form-button").onclick=saveCandidate
}

function deleteCandidate(id){
    id=Number(id)
    candidatesCache.delete(id)
    fetch("http://localhost:8080/candidate/delete/"+id,{
        method: "DELETE",
        headers: {'Accept': 'application/json'}
    })
        .then(response => {
            if(!response.ok)
                throw "Failed to delete candidate"
            else
                updateCandidatesTable()
        })
}

//Sorterer alle kandidaterne efter parti
function sortByParty(){
    let sortedCandidates=candidatesCache.getAll().sort((a,b)=>a.party.localeCompare(b.party))
    candidatesCache.setAll(sortedCandidates)
    updateCandidatesTable()
}