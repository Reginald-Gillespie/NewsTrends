

## https://reginald-gillespie.github.io/NewsTrends

I threw this together to mess with bulk-analyzing news sources in various methods.

The statistics used to generate these images comes from >10 news sources scraped with selenium and parsed with news-please. More sources to come eventually.


## Frequency
Frequency is the number of times the word has been seen. This number is decayed over time:
```python
time_diff = current_time - last_updated
...
dayInSeconds = 86400
DECAY_CONSTANT = math.log(2) / (dayInSeconds * 1)
...
decayed_frequency = old_frequency * math.exp(-DECAY_CONSTANT * time_diff)
```

## Velocity
Velocity is the change in frequency. This one is a little more jank, such as basing it off of the time the articles are fetched, rather than based off the release date of the article itself:
```python
velocity = (decayed_frequency + count - old_frequency) / time_diff
```

### TODO
- [ ] Mobile support
- [ ] More colors in background?
- [ ] Stablized-velocity (slower updating per run)
- [ ] Spread-sort (sorting by stablized-velocity/frequency but with a bias towards words seen from more outlets)
- [ ] Improve bot avoidance and implement better parsing
- [ ] Play with how ublock with no javascript is able to read washingtonpost, but my selenium setup can't 
