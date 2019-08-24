import pandas as pd

from os import walk
mypath = 'C:\\Users\\pranav.vadrevu\\Amazon_scraper\\Website\\xray_jsonfiles'
f = []
for (dirpath, dirnames, filenames) in walk(mypath):
    f.extend(filenames)
    break
print(len(f))
counter = 1
for file in f:
    counter += 1
    df = pd.read_csv(file, error_bad_lines=False)
    df["duration"] = df["end (min)"] - df["start (min)"]
    df.to_csv(file)
    print(counter + " success!")