I've reviewed the reconciliation.controller.ts and manuscript.model.ts.

Here's what I've found:

- `manuscript.model.ts`: It has a ManuscriptStatus.IN_RECONCILIATION status. This is perfect. The reconciliation.controller.ts even
  has a comment // Or a new IN_RECONCILIATION status. It seems the intention was to use this.
- `reconciliation.controller.ts`: When a discrepancy is found, it finds a third reviewer (a reconciliation reviewer) and assigns  
  them. It then sets the manuscript status to UNDER_REVIEW. It should be setting it to IN_RECONCILIATION.

Updated Plan:

My previous plan is still valid, but I'll add the following to address the user's latest request:

Phase 1: Modify `assignReview.controller.ts` (No changes to this phase of the plan)

1.  I will rename assignReviewers to assignReviewer and modify it to assign only one reviewer at a time.
2.  This new assignReviewer method will accept an assignmentType ('automatic' or 'manual'). For manual assignments, it will also  
    accept a reviewerId.
3.  I will add a getEligibleReviewers method to this controller so the frontend can fetch a list of reviewers for manual assignment.

Phase 2: Modify `reAssignReviewer.controller.ts`

1.  I will update the reassignReview method to also accept an assignmentType ('automatic' or 'manual').
2.  I will add a new method, getExistingReviewers, which will take a manuscriptId and return the currently assigned reviewers.  
    Crucially, the response for each reviewer will include the `reviewType` ('human' or 'reconciliation') and the `status` of the
    manuscript itself. This will give the frontend all the information it needs to know if it's a regular or reconciliation  
    re-assignment.
3.  The reassignReview method will handle both human and reconciliation reviews based on the reviewId provided.

Phase 3: Update `reconciliation.controller.ts`

1.  I will modify the handleDiscrepancy method in reconciliation.controller.ts to set the manuscript status to
    ManuscriptStatus.IN_RECONCILIATION when a reconciliation reviewer is assigned. This will provide a clear signal to the frontend
    about the state of the manuscript.

This updated plan directly addresses the user's question about identifying reconciliation reviews and also fixes a small bug in
the reconciliation.controller.ts.

I will now present this updated plan to the user.

"You've brought up an excellent point about identifying reconciliation reviews. I've looked at the reconciliation.controller.ts  
 and the manuscript.model.ts and I have an updated plan.

My Updated Plan:

My original plan for assignReview.controller.ts and reAssignReviewer.controller.ts remains the same. Here's how I'll address your
new requirement:

For `reAssignReviewer.controller.ts`:

- The new getExistingReviewers method will be key. For each reviewer assigned to a manuscript, I will include the reviewType  
  ('human' or 'reconciliation') in the response. This will tell your frontend exactly what kind of review you are about to  
  re-assign.

A Small Improvement:

- I noticed that when a discrepancy is found, the reconciliation.controller.ts sets the manuscript status to UNDER_REVIEW. The  
  manuscript.model.ts actually has a more specific status for this: IN_RECONCILIATION.
- I will update the reconciliation.controller.ts to use the IN_RECONCILIATION status. This will give your frontend a clear and  
  immediate signal that the manuscript has entered the reconciliation stage.

So, to summarize, your frontend will be able to identify a reconciliation re-assignment in two ways:

1.  The manuscript status will be IN_RECONCILIATION.
2.  The getExistingReviewers endpoint will show a reviewer with reviewType: 'reconciliation'.

This approach should give you all the information you need.

Does this updated plan work for you? If so, I will start with Phase 1: Modifying assignReview.controller.ts."You've brought up an
excellent point about identifying reconciliation reviews. I've looked at the reconciliation.controller.ts and the
manuscript.model.ts and I have an updated plan.

My Updated Plan:

My original plan for assignReview.controller.ts and reAssignReviewer.controller.ts remains the same. Here's how I'll address your
new requirement:

For `reAssignReviewer.controller.ts`:

- The new getExistingReviewers method will be key. For each reviewer assigned to a manuscript, I will include the reviewType
  ('human' or 'reconciliation') in the response. This will tell your frontend exactly what kind of review you are about to
  re-assign.

A Small Improvement:

- I noticed that when a discrepancy is found, the reconciliation.controller.ts sets the manuscript status to UNDER_REVIEW. The
  manuscript.model.ts actually has a more specific status for this: IN_RECONCILIATION.
- I will update the reconciliation.controller.ts to use the IN_RECONCILIATION status. This will give your frontend a clear and
  immediate signal that the manuscript has entered the reconciliation stage.

So, to summarize, your frontend will be able to identify a reconciliation re-assignment in two ways:

1.  The manuscript status will be IN_RECONCILIATION.
2.  The getExistingReviewers endpoint will show a reviewer with reviewType: 'reconciliation'.

This approach should give you all the information you need.

This is how it works hopefully it clarifies things, the author submit a a manuscript and then the admin assigns the manuscript a cluster (maybe he inferred it from the faculty field of the author user) and then assigns the manuscript to two different reviewers in the eligible clusters

Just context of prompt I used

when building the backend

Yes same workload based logic, yes reset the due date. yes can't be assigned twice to the same manuscript, also the reAssign
controller, is there a way for my frontend to know if the re assignment is a regular or reconciliation review, check the manscript  
 model, when there's a discrepancy in the reviewDecision of the two reviewers then a reconciliation reviewer is given/automatically  
 assigned the manuscript (In cases where that fails probably ther's no eligble person availble, I want the reAssign controller to be  
 able to reAssign the manuscript to someone else or even the admin using the manual method since the admin only comes up in manual  
 assignment or reAssignment), (the logic for all are in some of the controller files in this Review_System folder you can check all),  
 Well I want to be able to reAssign that reconcilaition manuscript too to another reviewer, now I think the reAssignReviewers controller
already handles this but I don't know if ther's a way for the fronted to know if it's a regular reAssignment or reconciliation  
 assignment, maybe one of the status in the manuscript model can help

This is just another context/prompt for when I was doing the backend but you should note that I have implemented all this in the backend so don't worry just use them as context to do the frontend better.
