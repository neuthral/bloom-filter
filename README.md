# bloom filter implementation in javascript

to test usage first get ubuntus wordlist
```sh
cat /usr/share/dict/words >> words.txt

wcl- words.txt
104334 words.txt
```

now we have a list of words and the number of items to store,
then we run the script with the values, here i put a 0.001 
false positive rate
```sh
bun run src/cli.js -f words.txt -i 104334 -p 0.001 -s words

saved words and metadata words.json
Array length in bytes 1500071 Hash count 9
The script uses approximately 14.31 MB
```

then you can test the filter with words from the wordlist, edit 
the searchValues array if using another wordlist

```sh
bun run src/search.js
```