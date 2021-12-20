let partyCache = []
let totalVotes = 0

fetch("http://localhost:8080/candidate/read-all")
    .then(response => {
        return response.json()
    })
    .then(candidates => {
        candidatesCache.setAll(candidates)
        candidatesCache.getAll().forEach(c => {
            let party = partyCache.find(p => p.partyName == c.party)
            if(party)
                party.votes += c.votes
            else
                partyCache.push({partyName:c.party, votes:c.votes, percent:0})
            totalVotes += c.votes
        })
        calculatePercent()
        updatePartiesTable()
    })

function updatePartiesTable(){
    let partyTableRows = ""
    if(partyCache.length>0) {
        partyCache.forEach(p => partyTableRows += candidateToTableRow(p))
        document.getElementById("party-table-body").innerHTML = partyTableRows
    }
}

function candidateToTableRow(party){
    return `<tr>
        <td class="party-name">${party.partyName}</td>
        <td class="votes">${party.votes}</td>
        <td class="percent">${party.percent}%</td>
    </tr>`
}

function calculatePercent(){
    partyCache.forEach(p => p.percent=Math.round((p.votes/totalVotes)*100))
}