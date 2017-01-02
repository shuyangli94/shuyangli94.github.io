function convertPubMedID(id, targetFormat, callback = function(id) {return id;}) {
	var url = "https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?ids=" + encodeURI(id) + "&format=json";
	corsGET(url, function(response) {
		var newID = response.query.results.json.records[0][targetFormat.toLowerCase()];
		console.log(newID);
		return callback(newID);
	});
}

var targetPMID = "23193287"; // PMID format
var targetPMCID = "PMC3531190"; // PMCID format
var targetDOI = "10.1093/nar/gks1195" // DOI format

// Convert from PMID to PMID to DOI
var eventualDOI = convertPubMedID(targetPMID, "PMCID", function(id) {convertPubMedID(id, "DoI")});



