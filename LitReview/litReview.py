import sys, os, re, requests, urllib, scipy
import numpy as np

def convertPubMedID(id, idType):
	if not idType.lower() in ['pmid','pmcid','doi','mid']:
		raise TypeError("Invalid PubMed ID type: '" + idType + "', must be PMID, PMCID, or DOI.")
	url = "https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?ids=" + urllib.quote_plus(id) + "&format=json"
	r = requests.get(url)
	records = r.json()["records"][0]
	if idType.lower() == 'mid':
		versions = records["versions"]
		current = [d["mid"] for d in versions if "current" in d and d["current"] == "true"]
		return current[0]
	if idType.lower() not in records:
		return None
	return records[idType.lower()]

def queryPubmed(query):
	url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc&term=' + urllib.quote_plus(query)
	print url

def findLinks(id):
	# &cmd=neighbor_score gives scores as well
	url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/elink.fcgi?dbfrom=pubmed&linkname=pubmed_pubmed_refs&id=' + urllib.quote_plus(convertPubMedID(id, "pmid")) + "&format=json"
	r = requests.get(url)
	return r.json()["linksets"][0]["linksetdbs"][0]["links"]


referencePMCID = "PMC548328" # Effects of familial hemiplegic migraine type 1 mutations on neuronal P/Q-type Ca2+ channel activity and inhibitory synaptic transmission - Cao Y, Tsien RW
# print convertPubMedID("5247266", "pmcid")
# print convertPubMedID("9546526", "pmcid")

print findLinks("PMC548328")