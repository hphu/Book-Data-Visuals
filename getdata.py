'''
Scripts to parse and gather data from dump
python 2.7
'''

import json
import re


def generatejson():
        data = open("/Users/Majestic/Desktop/ol_dump_editions_2013-12-31.txt", "r")
        newdata = open("/Users/Majestic/Desktop/newjson.txt", "w")
        headingpattern = re.compile(r"^[^{]*")
        list1 = []
        for line in data:
                line = headingpattern.sub('', line) #remove unecessary header data
                if ('number_of_pages' in line and 'publish_date' in line): #ignore objects missing vital data
                        line = json.loads(line)
                        book = dict()
                        book['number_of_pages'] = line['number_of_pages']
                        book['publish_date'] = line['publish_date']
                        try:
                                book['subjects'] = line['subjects']
                        except:
                                book['subjects'] = 'unlisted'
                        newdata.write(json.dumps(book) + "\n")
        data.close()
        newdata.close()

def category_pages():
        data = open("/Users/Majestic/Desktop/newjson.txt", "r")
        categorypagedict = dict()
        countpercategory = dict() #for computing averages
        for line in data:
                line = json.loads(line)
                mng = managesubjectpg(categorypagedict, countpercategory, line)
                categorypagedict = mng[0]
                countpercategory = mng[1]
        print categorypagedict
        print countpercategory
        data2 = open("/Users/Majestic/Desktop/category_page_counts.txt", "w")
        for (category, count) in categorypagedict.items():
                data2.write(category + " " + str(count) + "\n")
        data2.close()
        data.close()

def managesubjectpg(thedict, countdict, line):
        matchany = False
        listofsubjects = ['Art', 'Architecture', 'Photography', 'Bible', 'Religio', 'Christian', 'Judaism', 'Biography', 'Business', 'Computer', 'Computing' , 'Technology', 'Food', 'Cook', 'Crafts', 'Education', 'Engineering', 'Foreign Language', 'Gay & Lesbian', 'Health', 'Fitness', 'Law', 'Medical', 'Music', 'Film', 'Theater', 'Spiritual', 'Nonfiction', 'Parenting', 'Philosophy', 'Politics', 'Psychology', 'Relationships', 'Nature', 'Social Science', 'Sports', 'Travel', 'Fiction', 'Horror', 'Mystery', 'Poetry', 'Literature', 'Romance', 'Fantasy', 'Thriller', 'Western', 'Science Fiction', 'History', 'Economic', 'Social', 'Science', 'Political', 'Statistics', 'Mathematic', 'Geneoalogy', 'Government', 'Transportation', 'Chemistry', 'Sociology', 'Physics', 'Geology', 'Biology', 'Humor', 'Environmental']  
        if line["subjects"] == 'unlisted':
                try:
                        thedict = addtodict(thedict,'Unlisted', int(line["number_of_pages"]))
                        countdict = addtodict(countdict, 'Unlisted')
                except:
                        pass
        else:
                for x in listofsubjects:
                        if subjecthelper(x, line["subjects"]):
                                matchany = True
                                try:
                                        thedict = addtodict(thedict, x, int(line["number_of_pages"]))
                                        countdict = addtodict(countdict,x)
                                except:
                                        pass
                if matchany == False:
                        try:
                                thedict = addtodict(thedict, 'Other', int(line["number_of_pages"]))
                                countdict = addtodict(countdict, 'Other')
                        except:
                                pass
        return (thedict, countdict)

# return a dictionary of categories and their counts
def category_count():
        data = open("/Users/Majestic/Desktop/newjson.txt", "r")
        categorydict = dict()
        for line in data:
                try:
                        line = json.loads(line)
                except:
                        print line
                categorydict = managesubjects(categorydict, line['subjects']) 
        print categorydict
        data2 = open("/Users/Majestic/Desktop/category_counts.txt", "w")
        for (category, count) in categorydict.items():
                data2.write(category + " " + str(count) + "\n")
        data2.close()
        data.close()

def managesubjects(thedict, booksubjects):
        matchany = False
        listofsubjects = ['Art', 'Architecture', 'Photography', 'Bible', 'Religio', 'Christian', 'Judaism', 'Biography', 'Business', 'Computer', 'Computing' , 'Technology', 'Food', 'Cook', 'Crafts', 'Education', 'Engineering', 'Foreign Language', 'Gay & Lesbian', 'Health', 'Fitness', 'Law', 'Medical', 'Music', 'Film', 'Theater', 'Spiritual', 'Nonfiction', 'Parenting', 'Philosophy', 'Politics', 'Psychology', 'Relationships', 'Nature', 'Social Science', 'Sports', 'Travel', 'Fiction', 'Horror', 'Mystery', 'Poetry', 'Literature', 'Romance', 'Fantasy', 'Thriller', 'Western', 'Science Fiction', 'History', 'Economic', 'Social', 'Science', 'Political', 'Statistics', 'Mathematic', 'Geneoalogy', 'Government', 'Transportation', 'Chemistry', 'Sociology', 'Physics', 'Geology', 'Biology', 'Humor', 'Environmental']  
        if booksubjects == 'unlisted':
                thedict = addtodict(thedict,'Unlisted')
        else:
                for x in listofsubjects:
                        if subjecthelper(x, booksubjects):
                                matchany = True
                                thedict = addtodict(thedict, x)
                if matchany == False:
                        thedict = addtodict(thedict, 'Other')

        return thedict

def subjecthelper(subject, book):
        for s in book:
                if subject in s.lower().title():
                        return True
        return False

def addtodict(thedict, item, x=1):
        if item in thedict:
                thedict[item] +=x
        else:
                thedict[item] = x
        return thedict

#counts occurences of subjects from original list to get large unspecified categories
def wordcount():
        wordcountdict = dict()
        data = open("/Users/Majestic/Desktop/newjson.txt", "r")
        for line in data:
                line = json.loads(line)
                try:
                        wordcountdict = managesubjects(wordcountdict, line['subjects'])
                except:
                        wordcountdict = managesubjects(wordcountdict, ['misc'])
        data2 = open("/Users/Majestic/Desktop/counts.txt", "w")
        for (word, count) in wordcountdict.items():
                if (count > 1922):
                        data2.write(word.encode('utf-8') + " " + str(count) + "\n")
                        print "%r %s" % (word, str(count))
        data2.close()
        data.close()

def publish_dates():
        data = open("/Users/Majestic/Desktop/newjson.txt", "r")
        digit4 = re.compile(r"\d{4}")
        listofdates = [0] * 3000
        undecipherable = 0
        for line in data:
                line = json.loads(line)
                try:
                        line["publish_date"] = line["publish_date"].replace("u", "0")
                        listofdates[int(re.findall(digit4, line["publish_date"])[0])] +=1                    
                except:
                                undecipherable +=1
        print listofdates
        print undecipherable
        listdata = open("/Users/Majestic/Desktop/datecounts.txt", "w")
        for i in range(0,2015):
                listdata.write(str(i) + " " + str(listofdates[i]) + "\n")
        listdata.write("undecipherable " + str(undecipherable))
        data.close()
        listdata.close()

def jsontxt():
        data = open("/Users/Majestic/Desktop/category_counts.txt", "r")
        print "[ \n"
        for line in data:
                line = line.split()
                print '{ "name": "%s", "value": %s },' % ("".join(line[:-1]), line[-1:][0])
        print "]"
        data.close()

category_pages()
