function wp_action(data, svg_area) {
    total_edits += 1;
    // if (total_edits == 1) {
    //     $('#edit_counter').html('You have seen <span>' + total_edits + ' possible planets detected</span>.');
    // } else {
    //     $('#edit_counter').html('You have seen a total of <span>' + insert_comma(total_edits) + ' total planets</span>.');
    // }
    var now = new Date();
    edit_times.push(now);
    to_save = [];
    

    var size = data["Planet Radius"]*50;
    var label_text = data["KOI Name"];
    var csize = size;
    var no_label = false;
    var type;
    if (data["Kepler Disposition"]== 'NOT DISPOSITIONED') {
        type = 'anon';
    } else if (data["Kepler Disposition"] ==  'CANDIDATE') {
        type = 'user';
    } else {
        type = 'bot';
    }


    var circle_id = 'd' + ((Math.random() * 100000) | 0);
    var abs_size = Math.abs(size);
    size = Math.max(Math.sqrt(abs_size) * scale_factor, 3);

   // Math.seedrandom(data.page_title)
    var x = Math.random() * (width - size) + size;
    var y = Math.random() * (height - size) + size;
    if (csize > 0) {
        play_sound(size, 'add', 1);
    } else {
        play_sound(size, 'sub', 1);
    }

    console.log("X: " + x + " Y " + y + " size " + size);
//    console.log("Y: " + y);
//    console.log("width" + width);
 //   console.log("Size " + size);
//    console.log("height "  + height);

    var circle_id = 'd' + ((Math.random() * 100000) | 0);




    var circle_group = svg_area.append('g')
        .attr('transform', 'translate(' + x + ', ' + y + ')')
        .attr('fill', edit_color);

    var ring = circle_group.append('circle')
         .attr({r: size + 20,
                stroke: 'none'})
         .transition()
         .attr('r', size + 40)
         .style('opacity', 0)
         .ease(Math.sqrt)
         .duration(2500)
         .remove();

    var circle_container = circle_group.append('a')
        .attr('xlink:href', data["KOI Name"])
        .attr('target', '_blank')
        .attr('fill', svg_text_color);

    var circle = circle_container.append('circle')
        .classed(type, true)
        .attr('r', size)
        .transition()
        .duration(max_life)
        .style('opacity', 0)
        .each('end', function() {
            circle_group.remove();
        })
        .remove();

    circle_container.on('mouseover', function() {
        if (no_label) {
            no_label = false;
            circle_container.append('text')
                .text(label_text)
                .classed('article-label', true)
                .attr('text-anchor', 'middle')
                .transition()
                .delay(1000)
                .style('opacity', 0)
                .duration(2000)
                .each('end', function() { no_label = true; })
                .remove();
        }

    });

    if (s_titles) {
        var text = circle_container.append('text')
            .text(label_text)
            .classed('article-label', true)
            .attr('text-anchor', 'middle')
            .transition()
            .delay(1000)
            .style('opacity', 0)
            .duration(2000)
            .each('end', function() { no_label = true; })
            .remove();
    } else {
        no_label = true;
    }
}


function play_sound(size, type, volume) {
    var max_pitch = 100.0;
    var log_used = 1.0715307808111486871978099;
    var pitch = 100 - Math.min(max_pitch, Math.log(size + log_used) / Math.log(log_used));
    var index = Math.floor(pitch / 100.0 * Object.keys(celesta).length);
    var fuzz = Math.floor(Math.random() * 4) - 2;
    index += fuzz;
    index = Math.min(Object.keys(celesta).length - 1, index);
    index = Math.max(1, index);
    if (current_notes < note_overlap) {
        current_notes++;
        if (type == 'add') {
            celesta[index].play();
        } else {
            clav[index].play();
        }
        setTimeout(function() {
            current_notes--;
        }, note_timeout);
    }
}

function play_random_swell() {
    var index = Math.round(Math.random() * (swells.length - 1));
    swells[index].play();
}

function newuser_action(data, lid, svg_area) {
    play_random_swell();
    var messages = ['Welcome ' + data["KOI Name"] + ', the known planets in the universe'];
                    //'Wikipedia has a new user, ' + data.planet + '! Welcome!',
                   // 'Welcome, ' + data.planet + ' has joined Wikipedia!'];
    var message = Math.round(Math.random() * (messages.length - 1));
    var user_link = 'http://' + lid + '.wikipedia.org/w/index.php?title=User_talk:' + data["KOI name"] + '&action=edit&section=new';
   var user_group = svg_area.append('g');

    var user_container = user_group.append('a')
        .attr('xlink:href', user_link)
        .attr('target', '_blank');

    user_group.transition()
        .delay(7000)
        .remove();

    user_container.transition()
        .delay(4000)
        .style('opacity', 0)
        .duration(3000);

    user_container.append('rect')
        .attr('opacity', 0)
        .transition()
        .delay(100)
        .duration(3000)
        .attr('opacity', 1)
        .attr('fill', newuser_box_color)
        .attr('width', width)
        .attr('height', 35);

    var y = width / 2;

    user_container.append('text')
        .classed('newuser-label', true)
        .attr('transform', 'translate(' + y +', 25)')
        .transition()
        .delay(1500)
        .duration(1000)
        .text(messages[message])
        .attr('text-anchor', 'middle');

}


var make_click_handler = function($box, setting) {
    return function() {
            if ($box.is(':checked')) {
                enable(setting);
            } else {
                disable(setting);
            }
        };
};
