from pathlib import Path
import argparse
import json
import os
import re
import shutil
import urllib.request

def parseId(name):
  id_dict = { " ": "-", ".": "-", ",": "", '"': "", "(": "", ")": "", "'": "", ":": "", "!": "", "?": "", "/": "-", "☆": "-", "-&-": "-", " - ": "-", "á": "a", "à": "a", "ā": "a", "â": "a", "è": "e", "é": "e", "ī": "i", "ó": "o", "ú": "u", "ñ": "n", "ŋ": "ng" }
  parsed = name.lower()
  for key, value in id_dict.items():
    parsed = parsed.replace(key, value)
  return parsed

def parseContent(raw):
  content_dict = { "...": "…", "'": "’", '" ': '” ', '",': '”,', '".': '”.', ' "': ' “', '"\n': '”\n', ' \n': '\n', '  \n': '\n', '."': '.”', '?"': '?”', '"?': '”?', '!"': '!”', '…"': '…”', '<td>"': '<td>“', '!"': '!”', "#### ○": "#### ", "　</td>": "</td>", " </td>": "</td>", "？　": "？", "！　": "！", "Ａ": "A", "Ｂ": "B", "Ｃ": "C", "Ｄ": "D", "Ｅ": "E", "Ｐ": "P", "Ｑ": "Q", "Ｘ": "X", "１": "1", "２": "2", "３": "3", "４": "4", "５": "5", "６": "6", "７": "7", "８": "8", "９": "9", "０": "0", "＋": "+" }

  parsed = re.sub('^"', '“', raw, flags=re.M)
  for key, value in content_dict.items():
    parsed = parsed.replace(key, value)
  return parsed

def parseProfileContent(raw, lang):
  if lang == "en":
    # Full NP
    parsed = re.sub(r"^『(.*)』\nRank: (.*)\n(NP Type|Type): (.*)\nRange: (.*)[　|  |\n](Maximum Targets|Maximum Target): (.*)\n", r"#### 『\1』\n\n<table>\n  <tr><td>Rank</td><td>\2</td></tr>\n  <tr><td>\3</td><td>\4</td></tr>\n  <tr><td>Range</td><td>\5</td></tr>\n  <tr><td>\6</td><td>\7</td></tr>\n</table>\n\n", raw, flags=re.M)
    # Simple NP
    parsed = re.sub(r"^『(.*)』\nRank: (.*)[\n|　](NP Type|Type): (.*)\n", r"#### 『\1』\n\n<table>\n  <tr><td>Rank</td><td>\2</td></tr>\n  <tr><td>\3</td><td>\4</td></tr>\n</table>\n\n", parsed, flags=re.M)
    # Info
    parsed = re.sub(r"Height\/Weight: (.*)\n(Origin|Source): (.*)\n(Region|Area): (.*)\nAlignment: (.*)\nGender: (.*)", r"<table>\n  <tr><td>Height/Weight</td><td>\1</td></tr>\n  <tr><td>\2</td><td>\3</td></tr>\n  <tr><td>\4</td><td>\5</td></tr>\n  <tr><td>Alignment</td><td>\6</td></tr>\n  <tr><td>Gender</td><td>\7</td></tr>\n</table>\n", parsed, flags=re.M)
    # Skill
    parsed = re.sub(r"^(.*): ([A-Z|\?]{1,2}\+{0,3}-?)\n", r"#### \1: \2\n\n", parsed, flags=re.M)
    return parsed
  elif lang == "ja":
    # Full NP
    parsed = re.sub(r"^『(.*)』\nランク[：|:](.*)　種別[：|:](.*)\nレンジ[：|:](.*)　最大捕捉[：|:](.*)\n", r"#### 『\1』\n\n<table>\n  <tr><td>ランク</td><td>\2</td></tr>\n  <tr><td>種別</td><td>\3</td></tr>\n  <tr><td>レンジ</td><td>\4</td></tr>\n  <tr><td>最大捕捉</td><td>\5</td></tr>\n</table>\n\n", raw, flags=re.M)
    # Simple NP
    parsed = re.sub(r"^『(.*)』\nランク[：|:](.*)　種別[：|:](.*)\n", r"#### 『\1』\n\n<table>\n  <tr><td>ランク</td><td>\2</td></tr>\n  <tr><td>種別</td><td>\3</td></tr>\n</table>\n\n", parsed, flags=re.M)
    # Info
    parsed = re.sub(r"身長／体重[：|:](.*)\n出典：(.*)\n地域[：|:](.*)\n属性[：|:](.*)　　性別[：|:](.*)", r"<table>\n  <tr><td>身長／体重</td><td>\1</td></tr>\n  <tr><td>出典</td><td>\2</td></tr>\n  <tr><td>地域</td><td>\3</td></tr>\n  <tr><td>属性</td><td>\4</td></tr>\n  <tr><td>性別</td><td>\5</td></tr>\n</table>\n", parsed, flags=re.M)
    # Skill
    parsed = re.sub(r"^(.*)[：|:]([ＡＢＣＤＥＸ？－A-Z]{1,2}[＋+]{0,3})\n", r"#### \1：\2\n\n", parsed, flags=re.M)
    return parsed
  elif lang == "zh":
    # Full NP
    parsed = re.sub(r"^『(.*)』\n阶级[：|:](.*)　种类[：|:](.*)\n有效范围[：|:](.*)　最大捕捉[：|:](.*)\n", r"#### 『\1』\n\n<table>\n  <tr><td>阶级</td><td>\2</td></tr>\n  <tr><td>种类</td><td>\3</td></tr>\n  <tr><td>有效范围</td><td>\4</td></tr>\n  <tr><td>最大捕捉</td><td>\5</td></tr>\n</table>\n\n", raw, flags=re.M)
    # Simple NP
    parsed = re.sub(r"^『(.*)』\n阶级[：|:](.*)　种类[：|:](.*)\n", r"#### 『\1』\n\n<table>\n  <tr><td>阶级</td><td>\2</td></tr>\n  <tr><td>种类</td><td>\3</td></tr>\n</table>\n\n", parsed, flags=re.M)
    # Info
    parsed = re.sub(r"身高／体重[：|:](.*)\n出处：(.*)\n地域[：|:](.*)\n属性[：|:](.*)　　性别[：|:](.*)", r"<table>\n  <tr><td>身高／体重</td><td>\1</td></tr>\n  <tr><td>出处</td><td>\2</td></tr>\n  <tr><td>地域</td><td>\3</td></tr>\n  <tr><td>属性</td><td>\4</td></tr>\n  <tr><td>性别</td><td>\5</td></tr>\n</table>\n", parsed, flags=re.M)
    # Skill
    parsed = re.sub(r"^(.*)：([A-Z|\?]{1,2}\+{0,3}-?)\n", r"#### \1：\2\n\n", parsed, flags=re.M)
    return parsed
  else:
    print(f"Unknown lang: {lang}")

def getTitle(profile, lang):
  if profile['condType'] == 'none' and profile['id'] == 1:
    return ""
  if lang == "en":
    if profile['condType'] == 'svtFriendship':
      return f"### Bond {profile['condValues'][0]}"
    elif profile['condType'] == 'questClear':
      try:
        quest = urllib.request.urlopen(f"https://api.atlasacademy.io/raw/NA/quest/{profile['condValues'][0]}/1")
        parsedQuest = json.loads(quest.read())
        questName = parsedQuest['mstQuest']['name'].replace("'", "’").replace("...", "…")
        # https://github.com/atlasacademy/fgo-game-data-api/blob/master/app/data/enums.py#L1674
        # Main quest
        if parsedQuest['mstQuest']['type'] == 1:
          if parsedQuest['mstQuest']['chapterId'] in [1, 2, 3, 4, 5, 6, 7]:
            return f"### Clear Singularity {parsedQuest['mstQuest']['chapterId']} Main Quest 「{questName}」"
          else:
            return f"### Clear Main Quest 「{questName}」"
        # Interlude
        elif parsedQuest['mstQuest']['type'] == 3:
          return f"### Clear Interlude 「{questName}」"
        # Other Quests
        elif parsedQuest['mstQuest']['type'] in [2, 5]:
          return f"### Clear 「{questName}」"
        # Unknown
        else:
          print(f"UNKNOWN quest type: {parsedQuest['mstQuest']['type']}")
          return f"### Clear 「???」"
      except:
        print(f"NO QUEST FOUND")
        return f"### Clear 「???」"
    elif profile['condType'] == 'svtLimit':
      return f"### Perform Ascension {profile['condValues'][0]} Times"
    else:
      print(f"UNKNOWN condType type: {profile['condType']}")
      return f"### ???"
  elif lang == "ja":
    if profile['condType'] == 'svtFriendship':
      return f"### 絆Lv.{profile['condValues'][0]}で開放"
    elif profile['condType'] == 'questClear':
      try:
        quest = urllib.request.urlopen(f"https://api.atlasacademy.io/raw/JP/quest/{profile['condValues'][0]}/1")
        parsedQuest = json.loads(quest.read())
        questName = parsedQuest['mstQuest']['name'].replace("'", "’").replace("...", "…")
        # https://github.com/atlasacademy/fgo-game-data-api/blob/master/app/data/enums.py#L1674
        # Main quest
        return f"### 「{questName}」をクリアすると開放"
      except:
        print(f"NO QUEST FOUND")
        return f"### Clear 「???」"
    elif profile['condType'] == 'svtLimit':
      return f"### 霊基再臨{profile['condValues'][0]}回目で開放"
    else:
      print(f"UNKNOWN condType type: {profile['condType']}")
      return f"### ???"
  elif lang == "zh":
    if profile['condType'] == 'svtFriendship':
      return f"### 羁绊达到Lv.{profile['condValues'][0]}后开放"
    elif profile['condType'] == 'questClear':
      try:
        quest = urllib.request.urlopen(f"https://api.atlasacademy.io/raw/CN/quest/{profile['condValues'][0]}/1")
        parsedQuest = json.loads(quest.read())
        questName = parsedQuest['mstQuest']['name'].replace("'", "’").replace("...", "…")
        # https://github.com/atlasacademy/fgo-game-data-api/blob/master/app/data/enums.py#L1674
        # Main quest
        return f"### 通关「{questName}」后开放"
      except:
        print(f"NO QUEST FOUND")
        return f"### ？？？"
    elif profile['condType'] == 'svtLimit':
      return f"### 灵基再临达到第{profile['condValues'][0]}阶段后开放"
    else:
      print(f"UNKNOWN condType type: {profile['condType']}")
      return f"### ???"
  else:
    print(f"UNKNOWN lang: {lang}")

def getSvt(i, lang):
  data = urllib.request.urlopen(f"https://api.atlasacademy.io/nice/{lang}/servant/{i}?lore=True&lang=en")
  return json.loads(data.read())

def getCe(i, lang):
  data = urllib.request.urlopen(f"https://api.atlasacademy.io/nice/{lang}/equip/{i}?lore=True")
  return json.loads(data.read())

def writeSvt(lang, filename, folder, id, title, parsed, profile_num):
  with open(f'./output/{folder}/{filename}', 'w') as out:
    # normal profile
    if profile_num > 0:
      out.write("---\n")
      out.write(f"parent: {id}\n")
      out.write("source: fate-grand-order\n")
      out.write(f"id: profile-{profile_num}\n")
      out.write(f"language: {lang}\n")
      out.write(f"weight: {profile_num}\n")
      out.write("---\n")
      out.write("\n")
      out.write(f"{title}\n")
      out.write("\n")
    # info
    else:
      out.write("---\n")
      out.write("parent: attribute.servant\n")
      out.write("source: fate-grand-order\n")
      out.write(f"id: {id}\n")
      out.write(f"language: {lang}\n")
      out.write("weight: 0\n")
      out.write("---\n")
      out.write("\n")
    out.write(f"{parsed}")
    out.write(f"\n")

def writeCeAttr(id, fgoid, data):
  with open(f'./output/attr/{id}.json', 'w') as out:
    out.write(f'{{\n')
    out.write(f'  "type": "ce",\n')
    out.write(f'  "attrType": 1,\n')
    out.write(f'  "fgoId": {fgoid},\n')
    out.write(f'\n')
    out.write(f'  "img": [\n')
    out.write(f'    {{ "weight": 1, "id": "img_ce", "src": "C{fgoid:03}.png" }}\n')
    out.write(f'  ],\n')
    out.write(f'\n')
    out.write(f'  "attribute": {{\n')
    out.write(f'    "star": "star_{data["en"]["rarity"]}",\n')
    out.write(f'    "illustrator": "asd",\n')
    out.write(f'    "ce-type": "regular",\n')
    out.write(f'    "obtained": "event"\n')
    out.write(f'  }},\n')
    out.write(f'\n')
    out.write(f'  "data": {{\n')
    out.write(f'    "name": {{\n')
    out.write(f'      "en": "{data["en"]["name"]}",\n')
    out.write(f'      "ja": "{data["ja"]["name"]}",\n')
    out.write(f'      "zh": "{data["zh"]["name"]}"\n')
    out.write(f'    }},\n')
    out.write(f'    "event": {{\n')
    out.write(f'      "en": "Christmas 2021: Nightingale’s Christmas Carol",\n')
    out.write(f'      "ja": "クリスマス2019 ナイチンゲールのクリスマス･キャロル",\n')
    out.write(f'      "zh": "圣诞节2020 南丁格尔的圣诞颂歌"\n')
    out.write(f'    }}\n')
    out.write(f'  }},\n')
    out.write(f'\n')
    out.write(f'  "layout": [\n')
    out.write(f'    ["star", "illustrator"],\n')
    out.write(f'    ["ce-type", "obtained", "event"]\n')
    out.write(f'  ]\n')
    out.write(f'}}\n')

def writeCe(id, parsed, lang):
  with open(f'./output/content/{id}/attr.{lang}.md', 'w') as f:
    f.write("---\n")
    f.write("parent: attribute.ce\n")
    f.write("source: fate-grand-order\n")
    f.write(f"id: {id}\n")
    f.write(f"language: {lang}\n")
    f.write("weight: 0\n")
    f.write("---\n")
    f.write("\n")
    f.write(f"{parsed}")
    f.write(f"\n")

def processSvt():
  for i in range (MIN_ID, MAX_ID):
    print(f"\nparsing id {i}: ", end='')
    rawData = {
      "en": getSvt(i, "NA"),
      "ja": getSvt(i, "JP"),
      "zh": getSvt(i, "CN")
    }
    # Create folder
    id = parseId(rawData["en"]['name'])
    print(f"{id}")
    folder = f"{id}"
    Path(f"./output/{folder}").mkdir(parents=True, exist_ok=True)
    # Parse data
    for lang in ["en", "ja", "zh"]:
      for profile in rawData[lang]['profile']['comments']:
        filename = f"attr.{lang}.md" if profile['id'] == 1 else f"profile-{profile['id'] - 1}.{lang}.md"
        parsed = parseContent(parseProfileContent(profile['comment'], lang))
        title = getTitle(profile, lang)
        writeSvt(lang, filename, folder, id, title, parsed, profile['id'] - 1)

def processCe():
  for i in range (MIN_ID, MAX_ID):
    print(f"\nparsing id {i}: ", end='')
    rawData = {
      "en": getCe(i, "NA"),
      "ja": getCe(i, "JP"),
      "zh": getCe(i, "CN")
    }
    # Create folder
    id = parseId(rawData['en']['name'])
    print(f"{id}")
    Path(f"./output/attr").mkdir(parents=True, exist_ok=True)
    Path(f"./output/content/{id}").mkdir(parents=True, exist_ok=True)
    # Parse data
    for lang in ["en", "ja", "zh"]:
      writeCe(id, parseContent(rawData[lang]['profile']['comments'][0]['comment']), lang)
    writeCeAttr(id, i, rawData)

OVERWITE_DIR = True
MIN_ID = 1123
MAX_ID = 1128 + 1

'''
Svt: python3 fgo.py --type svt
Ce: python3 fgo.py --type ce

'''

parser = argparse.ArgumentParser(description='Short sample app')
parser.add_argument('--type', action="store", dest='type', default="svt")
args = parser.parse_args()
print(f"type: {args.type}")

if OVERWITE_DIR and os.path.isdir("./output"):
    shutil.rmtree("./output")

if (args.type == "svt"):
  processSvt()
elif (args.type == "ce"):
  processCe()
