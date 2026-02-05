l1=[10,20,30,40,50] 
l2=[110,120,130] 
print("original list of l1:",l1) 
print("original list of l2:",l2) 

l1.append(60) 
l1.append(70) 
 
l1.append(80) 
l1.append(90) 
l1.append(100) 
print("after completion of append:",l1) 
 
a=len(l1) 
print("length of the list:",a) 
#REMOVE 

l2.clear() 
print("l2 after removing of elements",l2) 
#POP 
l1.pop()
print("after removing the last element of l1",l1)
