X = categorical({'Understanding the Problem', 'Designing a solution', 'Evaluating a solution', 'Implementing a solution', 'Evaluating implemented solution'});
X = reordercats(X,{'Understanding the Problem', 'Designing a solution', 'Evaluating a solution', 'Implementing a solution', 'Evaluating implemented solution'}); % Preserve order of interventions
Y = [93, 38, 23, 54, 219];

plot = bar(X, Y);
set(plot,'FaceColor', [0.75 0.75 0.75]);
set(gca,'fontsize', 8);
set(gca,'LooseInset',get(gca,'TightInset'));
ylabel('Number of students');
set(gcf,'PaperUnits','centimeters'); 
set(gcf,'PaperSize',[8.40 8]);
fig = gcf; 
fig.PaperUnits = 'centimeters';  
fig.PaperPosition = [0 0 8.40 8]; 
fig.Units = 'centimeters'; 
fig.PaperSize=[8.40 8]; 
fig.Units = 'centimeters'; 
print(fig,'intervention_responses.pdf','-dpdf','-r200');