function wp_action(data, svg_area) {
    total_edits += 1;
     var now = new Date();
    edit_times.push(now);
    to_save = [];
    


    var size = data["Planet Radius"]*25;
    var referenceSize = 25; //25 is the scaling factor, and we are scaling by it so we just need the original
    var label_text = data["KOI Name"];
    var csize = size;
    var no_label = false;
    var type;
    if (data["Kepler Disposition"]== 'NOT DISPOSITIONED') {
        type = 'user';
    } else if (data["Kepler Disposition"] ==  'CANDIDATE') {
        type = 'anon';
        newuser_action(data,svg_area);
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
        // .attr({r: size + 20,
         //       stroke: 'none'})
        .attr({r: referenceSize, stroke:'white', opacity:.4})

         .transition()
         //.attr('r', ref + 40)

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

function play_candidate_sound(){
    // var max_pitch = 100.0;
    // var log_used = 1.0715307808111486871978099;
    // var pitch = 100 - Math.min(max_pitch, Math.log(size + log_used) / Math.log(log_used));
    // var index = Math.floor(pitch / 100.0 * Object.keys(celesta).length);
    // var fuzz = Math.floor(Math.random() * 4) - 2;
    // index += fuzz;
    // index = Math.min(Object.keys(celesta).length - 1, index);
    // index = Math.max(1, index);
    if (current_notes < note_overlap) {
        current_notes++;
        //if (type == 'add') {
          //  celesta[0].play();
          //  celesta[3].play();
           // celessta[5].play();
      //  } else {
        //    clav[index].play();
        //}
        setTimeout(function() {
            current_notes--;
        }, note_timeout);
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
        //if (type == 'add') {
            celesta[index].play();
      //  } else {
        //    clav[index].play();
        //}
        setTimeout(function() {
            current_notes--;
        }, note_timeout);
    }
}

function play_random_swell() {
    var index = Math.round(Math.random() * (swells.length - 1));
    swells[index].play();
}

function newuser_action(data, svg_area) {
   play_candidate_sound();
    var messages = ['Welcome ' + data["KOI Name"] + ', candidate planet to our known universe'];
      var message = Math.round(Math.random() * (messages.length - 1));
    var user_link = 'http://cnn.com';
   var user_group = svg_area.append('g');

    var user_container = user_group.append('a')
        .attr('xlink:href', user_link)
        .attr('target', '_blank');

    // user_group.transition()
    //     .delay(7000)
    //    .remove();

     user_container.transition()
         .delay(1000)
         .style('opacity', 0)
         .duration(500);

    user_container.append('rect')
        .attr('opacity', 0)
        .transition()
        .delay(250)
        .duration(500)
        .attr('opacity', 1)
        .attr('fill', newuser_box_color)
        .attr('width', width)
        .attr('height', 35);

    var y = width / 2;

    user_container.append('text')
        .classed('newuser-label', true)
        .attr('transform', 'translate(' + y +', 25)')
        .transition()
        .delay(250)
        .duration(500)
        .text(messages[message])
        .attr('text-anchor', 'middle');

}
