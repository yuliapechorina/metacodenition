fname = 'test_cases_failed.json';
fid = fopen(fname);
raw = fread(fid,inf); 
str = char(raw'); 
fclose(fid); 
results = jsondecode(str);

A_users = results.A.users;
B_users = results.B.users;

q1_num_test_cases = 10;
q2_num_test_cases = 12;

q1_failed_A = sum(cell2mat(struct2cell(results.A.q1)));
q1_percent_failed_A = q1_failed_A / (q1_num_test_cases * A_users) * 100;

q2_failed_A = sum(cell2mat(struct2cell(results.A.q2)));
q2_percent_failed_A = q2_failed_A / (q2_num_test_cases * A_users) * 100;

q1_failed_B = sum(cell2mat(struct2cell(results.B.q1)));
q1_percent_failed_B = q1_failed_B / (q1_num_test_cases * B_users) * 100;

q2_failed_B = sum(cell2mat(struct2cell(results.B.q2)));
q2_percent_failed_B = q2_failed_B / (q2_num_test_cases * B_users) * 100;

X = categorical({'Problem One', 'Problem Two'});
X = reordercats(X,{'Problem One', 'Problem Two'});
Y = [q1_percent_failed_A, q1_percent_failed_B; q2_percent_failed_A, q2_percent_failed_B];

plot = bar(X, Y, 'FaceColor','flat');
plot(1).CData(1, :) = [0.85 0.85 0.85];
plot(2).CData(1, :) = [0.5 0.5 0.5];
plot(1).CData(2, :) = [0.85 0.85 0.85];
plot(2).CData(2, :) = [0.5 0.5 0.5];

set(gca,'fontsize', 8);

ylabel('Test Cases Failed (%)');

xtips1 = plot(1).XEndPoints;
text(xtips1,[0, 0], 'Group A' ,'HorizontalAlignment','center','VerticalAlignment','cap', 'FontSize', 8);

xtips2 = plot(2).XEndPoints;
text(xtips2,[0, 0], 'Group B' ,'HorizontalAlignment','center','VerticalAlignment','cap', 'FontSize', 8);

a=gca;
a.XRuler.TickLabelGapOffset = 10;
a.XAxis.Limits = categorical({'Problem One', 'Problem Two'});
set(gca,'LooseInset',get(gca,'TightInset'));

set(gcf,'PaperUnits','centimeters'); 
set(gcf,'PaperSize',[8.40 5]);
fig = gcf; 
fig.PaperUnits = 'centimeters';  
fig.PaperPosition = [0 0 8.40 5]; 
fig.Units = 'centimeters'; 
fig.PaperSize=[8.40 5]; 
fig.Units = 'centimeters'; 
print(fig,'test_cases.pdf','-dpdf','-r200');