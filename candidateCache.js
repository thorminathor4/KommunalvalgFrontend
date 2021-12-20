let candidatesCache = createCandidatesCache()

function createCandidatesCache(){
    let candidates = []
    return {
        setAll: (all) => candidates = all,
        add: (c) => candidates.push(c),
        edit: (cIn) => candidates = candidates.map(c => c.id == cIn.id ? cIn : c),
        delete: (id) => candidates = candidates.filter(c => c.id !== Number(id)),
        findById : (id) => candidates.find(c => c.id == id),
        getAll : () => candidates
    }
}