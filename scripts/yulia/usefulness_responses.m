% Parse feedback
fname = 'feedback-1145-12-10-22.json';
fid = fopen(fname);
raw = fread(fid,inf); 
str = char(raw'); 
fclose(fid); 
feedback = jsondecode(str);

y = extractfield(feedback.data, 'usefulness');
filtered_y = y(~cellfun(@isnumeric, y));
scaled_y = str2double(filtered_y)./20;

h1 = histogram(scaled_y, 5);
h.BinLimits = [0 5];
set(h1,'FaceColor', [0.75 0.75 0.75]);
set(gca,'fontsize', 8);
set(gca,'LooseInset',get(gca,'TightInset'));
xlabel('Rating (out of 5)');
ylabel('Number of students');

set(gcf,'PaperUnits','centimeters'); 
set(gcf,'PaperSize',[8.40 5]);
fig = gcf; 
fig.PaperUnits = 'centimeters';  
fig.PaperPosition = [0 0 8.40 5]; 
fig.Units = 'centimeters'; 
fig.PaperSize=[8.40 5]; 
fig.Units = 'centimeters'; 
print(fig,'usefulness_responses.pdf','-dpdf','-r200');

