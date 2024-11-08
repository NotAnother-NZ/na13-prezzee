
# Grid Layout Optimization Algorithm

**Author:** Druhin Tarafder

## Introduction

This documentation outlines a proprietary algorithm designed to dynamically adjust and optimize a grid layout by ensuring that the grid is always fully filled. The algorithm breaks a given number of elements (e.g., cards) into a sequence of 2s and 3s, alternating between two types of 2s—`2(i)` and `2(ii)`—to avoid leaving any empty columns in the last row of the grid.

The algorithm is specifically designed to be used in cases where the layout dynamically adjusts the content, such as a case study grid or image gallery, ensuring that no column spaces are left empty in the last row, regardless of the number of elements.

## Algorithm Overview

### Key Features:

- **Alternating Pattern of 2 and 3**: The algorithm breaks down a given number `n` into sequences of 2s and 3s. It alternates between `2(i)` and `2(ii)` when multiple 2s are used in the sequence.
- **Dynamic Adjustments**: The algorithm automatically adjusts the sequence based on the total number of elements to ensure the grid is filled completely.
- **Unique Element Styling**: Certain elements (based on their position in the sequence) are styled uniquely, which can be useful for distinguishing important or featured content.

## Core Algorithm

### `breakNumber(n)`

This function takes an integer `n` (the total number of elements) and returns an array of numbers that breaks `n` into a sequence of 2s and 3s.

- **Multiples of 3**: If `n` is divisible by 3, it returns a sequence of only 3s.
- **Alternating 2(i) and 2(ii)**: When `n` cannot be divided evenly into 3s, it alternates between `2(i)` and `2(ii)` for the 2s in the sequence, ensuring a pattern is maintained.

```javascript
function breakNumber(n) {
    let sequence = [];
    let total = 0;
    let twoCount = 0;

    // Special case for multiples of 3
    if (n % 3 === 0) {
        while (total < n) {
            sequence.push(3);
            total += 3;
        }
        return sequence;
    }

    // Determine starting number
    let nextNum = (n % 5 === 0 || n % 5 === 3) ? 3 : 2;

    // Alternate between 3 and 2
    while (total < n) {
        if (total + nextNum > n) {
            if (nextNum === 3 && total + 2 <= n) {
                nextNum = 2;
            } else {
                break;
            }
        }

        if (nextNum === 2) {
            twoCount++;
            let label = (twoCount % 2 === 1) ? '2(i)' : '2(ii)';
            sequence.push(label);
            total += 2;
        } else {
            sequence.push(nextNum);
            total += 3;
        }

        nextNum = (nextNum === 3) ? 2 : 3;
    }

    // Final adjustment
    if (total < n) {
        if (n - total === 2) {
            twoCount++;
            let label = (twoCount % 2 === 1) ? '2(i)' : '2(ii)';
            sequence.push(label);
            total += 2;
        } else if (n - total === 3) {
            sequence.push(3);
            total += 3;
        } else {
            for (let i = sequence.length - 1; i >= 0; i--) {
                if (sequence[i] === 3) {
                    sequence[i] = '2(ii)';
                    total = total - 3 + 2;
                    twoCount++;
                    break;
                }
            }
            if (total < n) {
                let difference = n - total;
                if (difference === 2) {
                    twoCount++;
                    let label = (twoCount % 2 === 1) ? '2(i)' : '2(ii)';
                    sequence.push(label);
                    total += 2;
                }
            }
        }
    }

    return sequence;
}
```

### `findYIndices(sequence)`

This function calculates the indices of the unique elements (`2(i)` and `2(ii)`) in the grid layout based on the sequence returned by the `breakNumber` function.

- **Y-Indices Calculation**: For each `2(i)` and `2(ii)` in the sequence, the algorithm determines its index in the grid layout.

```javascript
function findYIndices(sequence) {
    let yIndices = [];
    let currentIndex = 1;

    sequence.forEach(element => {
        if (element === 3) {
            currentIndex += 3;
        } else if (element === '2(i)') {
            yIndices.push(currentIndex);
            currentIndex += 2;
        } else if (element === '2(ii)') {
            yIndices.push(currentIndex + 1);
            currentIndex += 2;
        }
    });

    return yIndices;
}
```

## jQuery Integration

### Case Study Grid Example

Here’s an example of how this algorithm can be integrated with jQuery to dynamically manage a grid layout:

- **Extract Data**: The jQuery script extracts data from existing grid elements, removes them, and uses the proprietary algorithm to calculate how to reorder and style the grid.
- **Unique Cards**: Cards that correspond to `2(i)` and `2(ii)` positions in the grid are given unique styles.

```javascript
$(document).ready(function() {
    // Get total number of case study cards
    var totalCards = $('#case-study-overview-showcase .cs-overview-card-item').length;

    // Calculate sequence and find unique indices based on the proprietary algorithm
    var sequence = breakNumber(totalCards);
    var uniqueIndices = findYIndices(sequence);

    $('#case-study-overview-showcase .cs-overview-card-item').each(function(index) {
        var cardLogoSrc = $(this).find('.cs-overview-card-logo').attr('src');
        var imageCoverElement = $(this).find('.image-cover');
        var imageCoverSrc = imageCoverElement.attr('src') || '';
        var heroBgColor = $(this).find('.cs-overview-hero').css('background-color');
        var tagBgColor = $(this).find('.cs-tag').css('background-color');
        var tagText = $(this).find('.title10').text();
        var titleText = $(this).find('.title7').text();
        var caseStudyLink = $(this).find('.cms-link-wrapper').attr('href');

        // Remove the card after extracting the data
        $(this).remove();

        // Check if the current index is in the uniqueIndices array
        if (uniqueIndices.includes(index + 1)) {
            // Create "unique" card with type2 structure
            var newCard = `
                <div class="cs-overview-card type2 cream">
                    <div class="cs-overview-hero type2" style="background-color:${heroBgColor}">
                        <img src="${imageCoverSrc}" class="image-cover">
                        <img src="${cardLogoSrc}" class="cs-overview-card-logo">
                    </div>
                    <div class="cs-overview-card-details type2">
                        <div class="cs-tag" style="background-color:${tagBgColor}">${tagText}</div>
                        <h2 class="title7">${titleText}</h2>
                    </div>
                    <a href="${caseStudyLink}" class="cms-link-wrapper"></a>
                </div>
            `;
        } else {
            // Create regular card
            var newCard = `
                <div class="cs-overview-card cream">
                    <div class="cs-overview-hero" style="background-color:${heroBgColor}">
                        <img src="${imageCoverSrc}" class="image-cover">
                        <img src="${cardLogoSrc}" class="cs-overview-card-logo">
                    </div>
                    <div class="cs-overview-card-details">
                        <div class="cs-tag" style="background-color:${tagBgColor}">${tagText}</div>
                        <h2 class="title7">${titleText}</h2>
                    </div>
                    <a href="${caseStudyLink}" class="cms-link-wrapper"></a>
                </div>
            `;
        }

        // Append the new card to the grid
        $('#case-study-overview-showcase-grid').append(newCard);
    });
});
```

## Application and Benefits

This algorithm ensures that the grid is always fully filled, regardless of how many elements are present. Key benefits include:

1. **Dynamic Content Handling**: Works well with dynamically generated content, ensuring no empty columns.
2. **Visually Balanced Layout**: By alternating the style of certain grid elements, the layout feels more balanced and visually appealing.
3. **Unique Element Highlighting**: Specific elements (such as featured case studies) can be highlighted based on their index in the sequence.

## Conclusion

This proprietary algorithm provides an efficient solution for dynamically filling and optimizing grid layouts. It ensures that grids always appear fully populated and balanced, even when the total number of elements varies. The alternation between `2(i)` and `2(ii)` also allows for a degree of customization and uniqueness in the presentation of specific content.

For further inquiries or implementation details, please feel free to contact the author.
