% Parse feedback
fname = 'feedback-1145-12-10-22.json';
fid = fopen(fname);
raw = fread(fid,inf); 
str = char(raw'); 
fclose(fid); 
feedback = jsondecode(str);

y1 = extractfield(feedback.data, 'easiness');
filtered_y1 = y1(~cellfun(@isnumeric, y1));
scaled_y1 = str2double(filtered_y1)./20;

y2 = extractfield(feedback.data, 'usefulness');
filtered_y2 = y2(~cellfun(@isnumeric, y1));
scaled_y2 = str2double(filtered_y2)./20;

figure(1);
hold on;
subplot(2,1,1);
h1 = histogram(scaled_y1, 5);
set(h1,'FaceColor', [0.75 0.75 0.75]);
set(gca,'fontname','times', 'fontsize', 8);
title({'Responses to ', '"How easy was it to use this tool?"'});
xlabel('Rating (out of 5)');
ylabel('Number of students');
subplot(2,1,2);
h2 = histogram(scaled_y2, 5);
set(h2,'FaceColor', [0.75 0.75 0.75]);
set(gca,'fontname','times', 'fontsize', 8);
title({'Responses to ', '"How helpful was the problem-solving assistance?"'});
xlabel('Rating (out of 5)');
ylabel('Number of students');

set(gcf,'PaperUnits','centimeters'); 
set(gcf,'PaperSize',[8.40 10]);
fig = gcf; 
fig.PaperUnits = 'centimeters';  
fig.PaperPosition = [0 0 8.40 10]; 
fig.Units = 'centimeters'; 
fig.PaperSize=[8.40 10]; 
fig.Units = 'centimeters'; 
print(fig,'usefulness_easiness_responses.pdf','-dpdf','-r200');

